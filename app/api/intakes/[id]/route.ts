import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import ProjectIntake from "@/models/ProjectIntake";
import { IntakeSchema } from "@/lib/validators/intake";
import mongoose from "mongoose";

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { userId, error } = requireUserId();
  if (error) return error;

  if (!isValidObjectId(params.id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectToDB();

  const intake = await ProjectIntake.findOne({ _id: params.id, userId }).lean();
  if (!intake)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ intake });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId, error } = requireUserId();
  if (error) return error;

  if (!isValidObjectId(params.id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);

  // Allow partial updates: validate by merging with existing
  await connectToDB();
  const existing = await ProjectIntake.findOne({ _id: params.id, userId });
  if (!existing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const merged = { ...existing.toObject(), ...body };
  const parsed = IntakeSchema.safeParse(merged);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid intake payload", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  existing.set(parsed.data);
  await existing.save();

  return NextResponse.json({ intake: existing });
}
