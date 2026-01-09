// app/api/intakes/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/db";
import ProjectIntake from "@/models/ProjectIntake";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ params is a Promise
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();

  const { id } = await params; // ✅ unwrap params here

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const intake = await ProjectIntake.findOne({ _id: id, userId });

  if (!intake) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ intake });
}
