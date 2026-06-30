import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Projexa — Planifier. Exécuter. Contrôler.",
    short_name: "Projexa",
    description:
      "Plateforme de gestion de projets de construction : planification, suivi financier, personnel, matériaux et facturation.",
    start_url: "/tableau-de-bord",
    display: "standalone",
    background_color: "#0b1220",
    theme_color: "#0b1220",
    lang: "fr",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
