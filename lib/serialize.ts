import mongoose from "mongoose";

/**
 * Recursively converts Mongo ObjectIds and other non-JSON-safe values
 * into plain JSON-serializable values (strings, objects, arrays).
 */
export function serializeMongo<T>(doc: any): T {
  if (doc === null || doc === undefined) return doc;

  // ✅ If it's a Mongoose document, convert to plain object first
  if (typeof doc?.toObject === "function") {
    return serializeMongo(doc.toObject());
  }

  if (doc instanceof mongoose.Types.ObjectId) return doc.toString() as any;
  if (doc instanceof Date) return doc.toISOString() as any;
  if (Array.isArray(doc)) return doc.map((item) => serializeMongo(item)) as any;

  if (typeof doc === "object") {
    const out: any = {};
    for (const [key, value] of Object.entries(doc))
      out[key] = serializeMongo(value);
    return out;
  }

  return doc;
}
