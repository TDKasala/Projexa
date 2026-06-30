import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Projexa — Planifier. Exécuter. Contrôler.",
  description:
    "Projexa est la plateforme de gestion de projets de construction : planning, finances, personnel, matériaux et facturation, réunis dans un seul outil.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Projexa",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1220",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
