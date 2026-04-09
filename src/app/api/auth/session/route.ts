import { getCurrentSession, requireCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return Response.json({ user: null });
  }

  const user = await requireCurrentUser();

  return Response.json({ user });
}