import type { Metadata } from "next";
import { Crimson_Text, IM_Fell_English } from "next/font/google";
import "./globals.css";

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-crimson-text",
  display: "swap",
});

const imFellEnglish = IM_Fell_English({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-im-fell-english",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "D&D 5e — Ficha de Personagem",
  description: "Ficha digital interativa para Dungeons & Dragons 5ª Edição",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${crimsonText.variable} ${imFellEnglish.variable}`}>
      <body className="font-serif">{children}</body>
    </html>
  );
}
