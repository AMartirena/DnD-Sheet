import { Prisma } from "@prisma/client";
import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Informe um email valido."),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres."),
  name: z.string().trim().min(2).max(80).optional(),
});

export const createSheetSchema = z.object({
  name: z.string().trim().min(1, "Informe um nome para a ficha.").max(120),
  data: z.object({}).passthrough().optional(),
});

export const updateSheetSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  data: z.object({}).passthrough().optional(),
});

export function apiError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function toPrismaJson(value: unknown) {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}