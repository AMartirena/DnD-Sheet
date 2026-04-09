import { prisma } from "@/lib/prisma";
import { apiError, authSchema } from "@/lib/api";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = authSchema.pick({ email: true, password: true }).safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Dados invalidos.");
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return apiError("Email ou senha invalidos.", 401);
  }

  const passwordMatches = await verifyPassword(parsed.data.password, user.passwordHash);

  if (!passwordMatches) {
    return apiError("Email ou senha invalidos.", 401);
  }

  await setSessionCookie({ userId: user.id, email: user.email });

  return Response.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
}