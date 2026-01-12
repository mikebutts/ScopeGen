// import { NextResponse } from "next/server";
// import { connectToDB } from "@/lib/db";
// import { requireUserId } from "@/lib/auth";
// import ProjectIntake from "@/models/ProjectIntake";
// import { IntakeSchema } from "@/lib/validators/intake";
// import mongoose from "mongoose";

// function isValidObjectId(id: string) {
//   return mongoose.Types.ObjectId.isValid(id);
// }

// export async function GET(_: Request, { params }: { params: { id: string } }) {
//   const { userId, error } = await requireUserId();
//   if (error) return error;

//   if (!isValidObjectId(params.id)) {
//     return NextResponse.json({ error: "Invalid id" }, { status: 400 });
//   }

//   await connectToDB();

//   const intake = await ProjectIntake.findOne({ _id: params.id, userId }).lean();
//   if (!intake)
//     return NextResponse.json({ error: "Not found" }, { status: 404 });

//   return NextResponse.json({ intake });
// }

// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const { userId, error } = requireUserId();
//   if (error) return error;

//   if (!isValidObjectId(params.id)) {
//     return NextResponse.json({ error: "Invalid id" }, { status: 400 });
//   }

//   const body = await req.json().catch(() => null);

//   // Allow partial updates: validate by merging with existing
//   await connectToDB();
//   const existing = await ProjectIntake.findOne({ _id: params.id, userId });
//   if (!existing)
//     return NextResponse.json({ error: "Not found" }, { status: 404 });

//   const merged = { ...existing.toObject(), ...body };
//   const parsed = IntakeSchema.safeParse(merged);
//   if (!parsed.success) {
//     return NextResponse.json(
//       { error: "Invalid intake payload", issues: parsed.error.issues },
//       { status: 400 }
//     );
//   }

//   existing.set(parsed.data);
//   await existing.save();

//   return NextResponse.json({ intake: existing });
// }
// app/api/intakes/[id]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import ProjectIntake from "@/models/ProjectIntake";
import { serializeMongo } from "@/lib/serialize";

type Ctx = {
  params: Promise<{ id: string }>;
};

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_req: Request, context: Ctx) {
  const { userId, error } = await requireUserId();
  if (error) return error;

  const { id } = await context.params; // ✅ IMPORTANT in Next 15/16

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectToDB();

  const doc = await ProjectIntake.findOne({ _id: id, userId }).lean();

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ intake: serializeMongo(doc) });
}

export async function DELETE(_req: Request, context: Ctx) {
  const { userId, error } = await requireUserId();
  if (error) return error;

  const { id } = await context.params; // ✅ IMPORTANT

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectToDB();

  const deleted = await ProjectIntake.findOneAndDelete({
    _id: id,
    userId,
  }).lean();

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, intake: serializeMongo(deleted) });
}

export async function PATCH(req: Request, context: Ctx) {
  const { userId, error } = await requireUserId();
  if (error) return error;

  const { id } = await context.params; // ✅ IMPORTANT

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectToDB();

  const body = await req.json();

  const updated = await ProjectIntake.findOneAndUpdate(
    { _id: id, userId },
    { $set: body },
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ intake: serializeMongo(updated) });
}
