import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "D&D 5e — Ficha de Personagem",
  description: "Ficha digital interativa para Dungeons & Dragons 5ª Edição",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=IM+Fell+English:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
