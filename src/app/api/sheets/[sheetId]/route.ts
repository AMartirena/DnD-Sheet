import { apiError, toPrismaJson, updateSheetSchema } from "@/lib/api";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = {
  params: {
    sheetId: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  const user = await requireCurrentUser();

  if (!user) {
    return apiError("Nao autenticado.", 401);
  }

  const sheet = await prisma.sheet.findFirst({
    where: {
      id: params.sheetId,
      userId: user.id,
    },
  });

  if (!sheet) {
    return apiError("Ficha nao encontrada.", 404);
  }

  return Response.json({
    sheet: {
      id: sheet.id,
      name: sheet.name,
      data: sheet.data,
      createdAt: sheet.createdAt,
      updatedAt: sheet.updatedAt,
    },
  });
}

export async function PUT(request: Request, { params }: Params) {
  const user = await requireCurrentUser();

  if (!user) {
    return apiError("Nao autenticado.", 401);
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSheetSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Dados invalidos.");
  }

  const existing = await prisma.sheet.findFirst({
    where: {
      id: params.sheetId,
      userId: user.id,
    },
  });

  if (!existing) {
    return apiError("Ficha nao encontrada.", 404);
  }

  const sheet = await prisma.sheet.update({
    where: { id: existing.id },
    data: {
      name: parsed.data.name?.trim() ?? existing.name,
      data: parsed.data.data ? toPrismaJson(parsed.data.data) : toPrismaJson(existing.data),
    },
    select: {
      id: true,
      name: true,
      updatedAt: true,
    },
  });

  return Response.json({ sheet });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await requireCurrentUser();

  if (!user) {
    return apiError("Nao autenticado.", 401);
  }

  const existing = await prisma.sheet.findFirst({
    where: {
      id: params.sheetId,
      userId: user.id,
    },
    select: { id: true },
  });

  if (!existing) {
    return apiError("Ficha nao encontrada.", 404);
  }

  await prisma.sheet.delete({ where: { id: existing.id } });

  return Response.json({ ok: true });
}