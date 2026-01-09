// /app/api/intakes/[id]/generate/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDB } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { serializeMongo } from "@/lib/serialize";

import ProjectIntake from "@/models/ProjectIntake";
import ScopeDoc from "@/models/ScopeDoc";

import { IntakeSchema } from "@/lib/validators/intake";
import { generateScopeFromIntake } from "@/lib/ai/generateScope";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Ctx) {
  try {
    const { userId, error } = await requireUserId();
    if (error) return error;

    const p = await params;
    if (!p?.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const id = p.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectToDB();

    // ✅ Intake must belong to the current user
    const intakeDoc = await ProjectIntake.findOne({ _id: id, userId }).lean();
    if (!intakeDoc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // ✅ Normalize/validate intake for the generator
    // If your IntakeSchema matches your DB shape exactly, you can do: IntakeSchema.parse(intakeDoc)
    // If not, map fields here. This mapping is safe and avoids surprises.
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
      deadline: intakeDoc.deadline,
      budgetRange: intakeDoc.budgetRange,
      riskFlags: intakeDoc.riskFlags ?? [],
      outputPrefs: intakeDoc.outputPrefs ?? {},
    });

    // ✅ Generate structured JSON scope doc (matches ScopeDocSchema)
    const generatedJson = await generateScopeFromIntake(intakeInput);

    // ✅ Versioning (optional). If your ScopeDoc model doesn't have `version`, remove this block.
    const latest = await ScopeDoc.findOne({ userId, intakeId: id })
      .sort({ version: -1 })
      .lean();

    const nextVersion = (latest?.version ?? 0) + 1;

    // ✅ Save using the fields your Mongoose model requires
    const scopeDoc = await ScopeDoc.create({
      userId,
      intakeId: id, // REQUIRED by your model
      generatedJson, // REQUIRED by your model
      editedJson: null,
      status: "generated",
      version: nextVersion,
    });

    return NextResponse.json(
      { scopeDoc: serializeMongo(scopeDoc) },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("❌ /api/intakes/[id]/generate failed:", err);
    return NextResponse.json(
      {
        error: "Generation failed",
        detail: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
