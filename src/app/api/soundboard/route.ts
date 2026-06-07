import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(80),
  url: z.string().url(),
  category: z.string().max(40).optional(),
  color: z.string().max(20).optional(),
  volume: z.number().min(0).max(1).optional(),
  loop: z.boolean().optional(),
  order: z.number().int().optional(),
});

// mesma função
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

// 🔹 GET
export async function GET() {
  const user = await getOrCreateUser();

  const buttons = await prisma.soundButton.findMany({
    where: { userId: user.id },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(buttons);
}

// 🔹 POST
export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();

  const body = await req.json();
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const button = await prisma.soundButton.create({
    data: {
      name: data.name,
      url: data.url,
      category: data.category ?? "geral",
      color: data.color ?? "#7a5c2e",
      volume: data.volume ?? 1.0,
      loop: data.loop ?? false,
      order: data.order ?? 0,
      userId: user.id,
    },
  });

  return NextResponse.json(button, { status: 201 });
}