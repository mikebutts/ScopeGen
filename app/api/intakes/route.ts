// /app/api/intakes/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import ProjectIntake from "@/models/ProjectIntake";
import { serializeMongo } from "@/lib/serialize";

export async function GET() {
  const { userId, error } = await requireUserId();
  if (error) return error;

  await connectToDB();

  const docs = await ProjectIntake.find({ userId })
    .sort({ updatedAt: -1 })
    .lean();

  return NextResponse.json({
    intakes: docs.map(serializeMongo),
  });
}
