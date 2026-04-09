import { AuthScreen } from "@/components/auth/AuthScreen";
import { SheetWorkspace } from "@/components/sheet/SheetWorkspace";
import { normalizeCharacterState } from "@/lib/character-state";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const user = await requireCurrentUser();

  if (!user) {
    return <AuthScreen />;
  }

  const sheets = await prisma.sheet.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      data: true,
    },
  });

  const initialActiveSheet = sheets[0]
    ? {
        ...sheets[0],
        createdAt: sheets[0].createdAt.toISOString(),
        updatedAt: sheets[0].updatedAt.toISOString(),
        data: normalizeCharacterState(sheets[0].data),
      }
    : null;

  return (
    <SheetWorkspace
      user={{
        id: user.id,
        email: user.email,
        name: user.name,
      }}
      initialSheets={sheets.map((sheet) => ({
        id: sheet.id,
        name: sheet.name,
        createdAt: sheet.createdAt.toISOString(),
        updatedAt: sheet.updatedAt.toISOString(),
      }))}
      initialActiveSheet={initialActiveSheet}
    />
  );
}
