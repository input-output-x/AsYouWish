import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "想你所想 · AsYouWish",
  description: "到一个城市，看见它的灵魂",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
