import { prisma } from "@/lib/prisma";
import { apiError, authSchema } from "@/lib/api";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = authSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? "Dados invalidos.");
    }

    const email = parsed.data.email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return apiError("Ja existe um usuario com este email.", 409);
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: parsed.data.name?.trim() || null,
        passwordHash: await hashPassword(parsed.data.password),
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    await setSessionCookie({ userId: user.id, email: user.email });

    return Response.json({ user });
  } catch (error) {
    console.error("auth.register.error", error);

    if (error instanceof Error && error.message.includes("AUTH_SECRET")) {
      return apiError("AUTH_SECRET nao foi configurado no servidor.", 500);
    }

    if (error instanceof Error && /DATABASE_URL|prisma|connect|database/i.test(error.message)) {
      return apiError("Nao foi possivel acessar o banco de dados.", 500);
    }

    return apiError("Falha interna ao criar a conta.", 500);
  }
}