import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  url: z.string().url().optional(),
  category: z.string().max(40).optional(),
  color: z.string().max(20).optional(),
  volume: z.number().min(0).max(1).optional(),
  loop: z.boolean().optional(),
  order: z.number().int().optional(),
});

// mesma função do route principal
async function getOrCreateUser() {
  let user = await prisma.user.findFirst({
    where: { email: "dev@local.com" },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "dev@local.com",
        name: "Dev User",
        passwordHash: "123",
      },
    });
  }

  return user;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getOrCreateUser();

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await prisma.soundButton.updateMany({
    where: {
      id: params.id,
      userId: user.id,
    },
    data: parsed.data,
  });

  const updated = await prisma.soundButton.findUnique({
    where: { id: params.id },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getOrCreateUser();

  await prisma.soundButton.deleteMany({
    where: {
      id: params.id,
      userId: user.id,
    },
  });

  return NextResponse.json({ success: true });
}