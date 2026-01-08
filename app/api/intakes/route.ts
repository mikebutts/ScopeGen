import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import ProjectIntake from "@/models/ProjectIntake";
import { IntakeSchema } from "@/lib/validators/intake";

export async function POST(req: Request) {
  const { userId, error } = await requireUserId();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = IntakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid intake payload", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  await connectToDB();

  try {
    const created = await ProjectIntake.create({
      userId,
      ...parsed.data,
    });

    return NextResponse.json({ intake: created }, { status: 201 });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function GET() {
  const { userId, error } = requireUserId();
  if (error) return error;

  await connectToDB();

  try {
    const intakes = await ProjectIntake.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ intakes });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
