// /app/api/scope/[id]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDB } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import ScopeDoc from "@/models/ScopeDoc";
import { serializeMongo } from "@/lib/serialize";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/scope/:id
export async function GET(_req: Request, { params }: Ctx) {
  const { userId, error } = await requireUserId();
  if (error) return error;

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectToDB();

  const scopeDoc = await ScopeDoc.findOne({ _id: id, userId }).lean();

  if (!scopeDoc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ scopeDoc: serializeMongo(scopeDoc) });
}

// PATCH /api/scope/:id
export async function PATCH(req: Request, { params }: Ctx) {
  const { userId, error } = requireUserId();
  if (error) return error;

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid update payload" },
      { status: 400 }
    );
  }

  // Only allow specific fields to be updated (recommended)
  const allowed: any = {};
  if ("editedJson" in body) allowed.editedJson = body.editedJson;
  if ("status" in body) allowed.status = body.status;

  await connectToDB();

  const updated = await ScopeDoc.findOneAndUpdate(
    { _id: id, userId },
    { $set: allowed },
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ scopeDoc: serializeMongo(updated) });
}

// DELETE /api/scope/:id (optional)
export async function DELETE(_req: Request, { params }: Ctx) {
  const { userId, error } = requireUserId();
  if (error) return error;

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectToDB();

  const deleted = await ScopeDoc.findOneAndDelete({ _id: id, userId }).lean();

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
