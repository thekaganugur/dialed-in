import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BrewMethod } from "./db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMethodBadgeColor(method: BrewMethod["name"]) {
  const colors = {
    v60: "bg-blue-100 text-blue-800",
    aeropress: "bg-green-100 text-green-800",
    french_press: "bg-purple-100 text-purple-800",
    espresso: "bg-red-100 text-red-800",
    chemex: "bg-orange-100 text-orange-800",
    moka: "bg-yellow-100 text-yellow-800",
    turkish: "bg-pink-100 text-pink-800",
    cold_brew: "bg-cyan-100 text-cyan-800",
  } as const;
  return colors[method] || "bg-gray-100 text-gray-800";
}

export function formatBrewDateTime(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatBrewDuration(seconds: number | undefined | null) {
  if (!seconds) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function calculateBrewRatio(
  doseGrams: string | null,
  yieldGrams: string | null,
) {
  if (!doseGrams || !yieldGrams) return null;

  const dose = Number(doseGrams);
  const yield_ = Number(yieldGrams);

  if (dose <= 0) return null;

  return `1:${(yield_ / dose).toFixed(1)}`;
}
