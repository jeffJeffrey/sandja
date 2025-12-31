import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SANDJA - Le Pagne du Futur",
    short_name: "SANDJA",
    description: "Redonner sens et valeur au pagne africain par la technologie",
    start_url: "/",
    display: "standalone",
    background_color: "#FDF8F3",
    theme_color: "#8B4513",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/images/logo/logo-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    categories: ["education", "lifestyle", "shopping"],
    lang: "fr",
    dir: "ltr",
  };
}
