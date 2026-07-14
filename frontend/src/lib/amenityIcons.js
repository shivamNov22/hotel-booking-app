import {
  Wifi,
  Snowflake,
  Tv,
  Bell,
  Droplet,
  GlassWater,
  Bed,
  Wind,
  Wine,
  Car,
  CheckCircle2,
} from "lucide-react";

// Matches by keyword rather than exact string, since amenities are free-text
// entered by the admin (e.g. "AC", "Air Conditioning", "A/C" should all match).
const RULES = [
  { keywords: ["wifi", "wi-fi", "internet"], icon: Wifi },
  { keywords: ["ac", "air condition"], icon: Snowflake },
  { keywords: ["tv", "television"], icon: Tv },
  { keywords: ["room service"], icon: Bell },
  { keywords: ["hot water", "geyser"], icon: Droplet },
  { keywords: ["mineral water", "water bottle"], icon: GlassWater },
  { keywords: ["bed", "rooms"], icon: Bed },
  { keywords: ["fan", "ventilation"], icon: Wind },
  { keywords: ["mini bar", "minibar"], icon: Wine },
  { keywords: ["parking", "pickup", "cab"], icon: Car },
];

export function getAmenityIcon(label = "") {
  const lower = label.toLowerCase();
  const match = RULES.find((rule) => rule.keywords.some((k) => lower.includes(k)));
  return match ? match.icon : CheckCircle2;
}
