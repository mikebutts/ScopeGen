import { auth } from "@clerk/nextjs/server";

export function requireUserId() {
  const { userId } = auth();
  if (!userId) {
    return {
      userId: null as string | null,
      error: new Response("Unauthorized", { status: 401 }),
    };
  }
  return { userId, error: null as Response | null };
}
