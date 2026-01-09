import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDB } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import ProjectIntake from "@/models/ProjectIntake";
import ScopeDoc from "@/models/ScopeDoc";
import { serializeMongo } from "@/lib/serialize";

import { IntakeSchema } from "@/lib/validators/intake";
import { generateScopeFromIntake } from "@/lib/ai/generateScope";

export async function POST(req: Request) {
  // ✅ Clerk user
  const { userId, error } = await requireUserId();
  if (error) return error;

  // ✅ Parse payload
  const body = await req.json().catch(() => null);
  const intakeId = body?.intakeId;

  if (!intakeId || typeof intakeId !== "string") {
    return NextResponse.json({ error: "Missing intakeId" }, { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(intakeId)) {
    return NextResponse.json({ error: "Invalid intakeId" }, { status: 400 });
  }

  await connectToDB();

  // ✅ Intake must belong to this user
  const intakeDoc = await ProjectIntake.findOne({
    _id: intakeId,
    userId,
  }).lean();

  if (!intakeDoc) {
    return NextResponse.json({ error: "Intake not found" }, { status: 404 });
  }

  // ✅ Validate/normalize intake shape for the generator
  const intakeInput = IntakeSchema.parse({
    projectName: intakeDoc.projectName,
    clientName: intakeDoc.clientName,
    clientEmail: intakeDoc.clientEmail,
    industry: intakeDoc.industry,
    projectType: intakeDoc.projectType,
    primaryGoal: intakeDoc.primaryGoal,
    description: intakeDoc.description,

    userTypes: intakeDoc.userTypes ?? [],
    roles: intakeDoc.roles ?? [],
    features: intakeDoc.features ?? [],

    mustHaves: intakeDoc.mustHaves,
    niceToHaves: intakeDoc.niceToHaves,

    designPreference: intakeDoc.designPreference,
    referenceLinks: intakeDoc.referenceLinks ?? [],
    screensEstimate: intakeDoc.screensEstimate,

    deadline: intakeDoc.deadline,
    budgetRange: intakeDoc.budgetRange,

    riskFlags: intakeDoc.riskFlags ?? [],

    outputPrefs: intakeDoc.outputPrefs ?? {},
  });

  // ✅ Generate the scopedoc JSON (validated in lib/ai/generateScope.ts)
  const generatedJson = await generateScopeFromIntake(intakeInput);

  // ✅ Versioning (v1, v2, v3...)
  const latest = await ScopeDoc.findOne({ userId, intakeId })
    .sort({ version: -1 })
    .lean();

  const nextVersion = (latest?.version ?? 0) + 1;

  // ✅ Save ScopeDoc
  const scopeDoc = await ScopeDoc.create({
    userId,
    intakeId,
    status: "generated",
    version: nextVersion,
    generatedJson,
    editedJson: null,
  });

  return NextResponse.json(
    { scopeDoc: serializeMongo(scopeDoc) },
    { status: 201 }
  );
}
