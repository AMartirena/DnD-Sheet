const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      email: true,
      name: true,
      createdAt: true,
      sheets: {
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          name: true,
          updatedAt: true,
        },
      },
    },
  });

  if (users.length === 0) {
    console.log("Nenhum usuario cadastrado.");
    return;
  }

  console.log(`Usuarios cadastrados: ${users.length}`);

  for (const user of users) {
    console.log("\n----------------------------------------");
    console.log(`Email: ${user.email}`);
    console.log(`Nome: ${user.name || "-"}`);
    console.log(`Criado em: ${formatDate(user.createdAt)}`);
    console.log(`Fichas salvas: ${user.sheets.length}`);

    if (user.sheets.length === 0) {
      console.log("  - Nenhuma ficha salva");
      continue;
    }

    for (const sheet of user.sheets) {
      console.log(`  - ${sheet.name} (${sheet.id}) | atualizada em ${formatDate(sheet.updatedAt)}`);
    }
  }
}

main()
  .catch((error) => {
    console.error("Falha ao listar usuarios:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });