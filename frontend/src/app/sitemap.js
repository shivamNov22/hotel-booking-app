import { mockHotel } from "@/data/mockHotel";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return [
    {
      url: `${base}/hotels/${mockHotel.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
