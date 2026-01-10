// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// import { connectToDB } from "@/lib/db";
// import { requireUserId } from "@/lib/auth";
// import ScopeDoc from "@/models/ScopeDoc";
// import { serializeMongo } from "@/lib/serialize";

// type Ctx = {
//   params: Promise<{ scopeId: string }>;
// };

// export async function GET(_req: Request, { params }: Ctx) {
//   const { userId, error } = requireUserId();
//   if (error) return error;

//   const { scopeId } = await params;

//   if (!mongoose.Types.ObjectId.isValid(scopeId)) {
//     return NextResponse.json({ error: "Invalid scope id" }, { status: 400 });
//   }

//   await connectToDB();

//   const doc = await ScopeDoc.findOne({ _id: scopeId, userId });

//   if (!doc) {
//     return NextResponse.json({ error: "Not found" }, { status: 404 });
//   }

//   // IMPORTANT: convert to plain object before serializing
//   const plain = doc.toObject();

//   return NextResponse.json({
//     scopeDoc: serializeMongo(plain),
//   });
// }
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import ScopeDoc from "@/models/ScopeDoc";

type Ctx = { params: { scopeId: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const { userId, error } = requireUserId();
  if (error) return error;

  const { scopeId } = params;

  if (!mongoose.Types.ObjectId.isValid(scopeId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectToDB();

  const scopeDoc = await ScopeDoc.findOne({ _id: scopeId, userId }).lean();

  if (!scopeDoc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ scopeDoc });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { userId, error } = requireUserId();
  if (error) return error;

  const { scopeId } = params;

  if (!mongoose.Types.ObjectId.isValid(scopeId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json();

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await connectToDB();

  const updated = await ScopeDoc.findOneAndUpdate(
    { _id: scopeId, userId },
    {
      $set: {
        editedJson: body,
        status: "draft",
      },
    },
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ scopeDoc: updated });
}
