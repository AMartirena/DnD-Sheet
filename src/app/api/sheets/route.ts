import { createDefaultCharacterState } from "@/lib/character-state";
import { apiError, createSheetSchema, toPrismaJson } from "@/lib/api";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await requireCurrentUser();

  if (!user) {
    return apiError("Nao autenticado.", 401);
  }

  const sheets = await prisma.sheet.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return Response.json({ sheets });
}

export async function POST(request: Request) {
  const user = await requireCurrentUser();

  if (!user) {
    return apiError("Nao autenticado.", 401);
  }

  const body = await request.json().catch(() => null);
  const parsed = createSheetSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Dados invalidos.");
  }

  const sheet = await prisma.sheet.create({
    data: {
      userId: user.id,
      name: parsed.data.name.trim(),
      data: toPrismaJson(parsed.data.data ?? createDefaultCharacterState()),
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return Response.json({ sheet }, { status: 201 });
}