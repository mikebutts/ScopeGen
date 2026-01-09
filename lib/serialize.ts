import mongoose from "mongoose";

/**
 * Recursively converts Mongo ObjectIds and other non-JSON-safe values
 * into plain JSON-serializable values (strings, objects, arrays).
 */
export function serializeMongo<T>(doc: any): T {
  if (doc === null || doc === undefined) return doc;

  // If it's an ObjectId, convert to string
  if (doc instanceof mongoose.Types.ObjectId) {
    return doc.toString() as any;
  }

  // If it's a Date, convert to ISO string
  if (doc instanceof Date) {
    return doc.toISOString() as any;
  }

  // If it's an array, serialize each item
  if (Array.isArray(doc)) {
    return doc.map((item) => serializeMongo(item)) as any;
  }

  // If it's a plain object, serialize each property
  if (typeof doc === "object") {
    const out: any = {};
    for (const [key, value] of Object.entries(doc)) {
      out[key] = serializeMongo(value);
    }
    return out;
  }

  // Primitive (string, number, boolean, etc)
  return doc;
}
