import mongoose from "mongoose";
import ScopeEditor from "@/components/scope/ScopeEditor";

import { connectToDB } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import ScopeDoc from "@/models/ScopeDoc";

type PageProps = {
  params: Promise<{ scopeId: string }>;
};

export default async function ScopePage({ params }: PageProps) {
  const { userId, error } = await requireUserId();
  if (error) return error; // keeps your pattern consistent

  const { scopeId } = await params;

  if (!mongoose.Types.ObjectId.isValid(scopeId)) {
    return <div style={{ padding: 16 }}>Invalid scope id</div>;
  }

  await connectToDB();

  const doc = await ScopeDoc.findOne({ _id: scopeId, userId }).lean();

  if (!doc) {
    return <div style={{ padding: 16 }}>Scope not found</div>;
  }

  // `lean()` already gives plain objects, but Mixed can contain weird stuff.
  // This forces it into JSON-safe plain data for the client component.
  const generatedJson = JSON.parse(JSON.stringify(doc.generatedJson ?? {}));
  const editedJson = JSON.parse(JSON.stringify(doc.editedJson ?? {}));

  return (
    <ScopeEditor
      scopeId={scopeId}
      initialGeneratedJson={generatedJson}
      initialEditedJson={editedJson}
    />
  );
}
