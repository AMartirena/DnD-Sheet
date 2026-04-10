const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const [, , emailArg, passwordArg] = process.argv;
  const email = emailArg?.trim().toLowerCase();
  const nextPassword = passwordArg?.trim();

  if (!email || !nextPassword) {
    console.error("Uso: npm run admin:reset-password -- email@exemplo.com novaSenha123");
    process.exitCode = 1;
    return;
  }

  if (nextPassword.length < 6) {
    console.error("A nova senha precisa ter ao menos 6 caracteres.");
    process.exitCode = 1;
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  if (!user) {
    console.error(`Usuario nao encontrado para o email ${email}.`);
    process.exitCode = 1;
    return;
  }

  const passwordHash = await bcrypt.hash(nextPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  console.log(`Senha atualizada com sucesso para ${user.email}.`);
}

main()
  .catch((error) => {
    console.error("Falha ao redefinir a senha:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });