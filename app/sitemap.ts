import type { MetadataRoute } from "next";
import { siteConfig, cabinets, pages } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const base = siteConfig.url;

  const home = {
    url: base,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 1,
  };

  const cabinetRoutes = cabinets.map((cabinet) => ({
    url: `${base}/${cabinet.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    // A live cabinet matters more than one that is still warming up.
    priority: cabinet.live ? 0.9 : 0.7,
  }));

  const pageRoutes = pages.map((page) => ({
    url: `${base}${page.path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [home, ...cabinetRoutes, ...pageRoutes];
}
