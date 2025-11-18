import type { Metadata } from "next";
import "./globals.scss";
import "@fontsource/noto-sans";
import "@fontsource/source-code-pro";

export const metadata: Metadata = {
  title: "Manjaro Web",
  description: "Manjaro KDE Web Desktop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}