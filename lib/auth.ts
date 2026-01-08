import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function requireUserId() {
  const user = await currentUser();
  if (!user) {
    return {
      userId: null as string | null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { userId: user.id, error: null as any };
}
