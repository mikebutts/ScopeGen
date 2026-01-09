// /app/api/intakes/[id]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDB } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import ProjectIntake from "@/models/ProjectIntake";
import { serializeMongo } from "@/lib/serialize";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { userId, error } = requireUserId();
  if (error) return error;

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectToDB();

  const intakeDoc = await ProjectIntake.findById(id);

  // if (!intakeDoc) {
  //   return NextResponse.json({ error: "Not found" }, { status: 404 });
  // }
  // if (!intakeDoc) {
  //   const exists = await ProjectIntake.findById(id).lean();

  //   return NextResponse.json(
  //     {
  //       error: "Not found",
  //       debug: exists
  //         ? {
  //             reason: "Intake exists but userId does not match current session",
  //             intakeUserId: exists.userId,
  //             currentUserId: userId,
  //           }
  //         : { reason: "No intake with that id exists" },
  //     },
  //     { status: 404 }
  //   );
  // }
  if (!intakeDoc) {
    const exists = await ProjectIntake.findById(id).lean();

    return NextResponse.json(
      {
        error: "Not found",
        debug: exists
          ? {
              reason: "Found intake but userId does not match current session",
              intakeUserId: exists.userId,
              currentUserId: userId,
            }
          : { reason: "No intake with that id exists" },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ intake: serializeMongo(intakeDoc) });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { userId, error } = requireUserId();
  if (error) return error;

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const updates = await req.json().catch(() => null);
  if (!updates || typeof updates !== "object") {
    return NextResponse.json(
      { error: "Invalid update payload" },
      { status: 400 }
    );
  }

  await connectToDB();

  const updatedDoc = await ProjectIntake.findOneAndUpdate(
    { _id: id, userId },
    { $set: updates },
    { new: true }
  ).lean();

  if (!updatedDoc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ intake: serializeMongo(updatedDoc) });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { userId, error } = requireUserId();
  if (error) return error;

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
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

  return NextResponse.json({ ok: true });
}
