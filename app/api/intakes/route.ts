import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import ProjectIntake from "@/models/ProjectIntake";
import { IntakeSchema } from "@/lib/validators/intake";

export async function POST(req: Request) {
  const { userId, error } = await requireUserId();
  if (error) return error;

  await connectToDB();

  const intakes = await ProjectIntake.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ intakes });
}
