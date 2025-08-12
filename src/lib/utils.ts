import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BrewMethod } from "./db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMethodBadgeColor(method: BrewMethod["name"]): string {
  const colors: Record<string, string> = {
    v60: "bg-blue-100 text-blue-800",
    aeropress: "bg-green-100 text-green-800",
    french_press: "bg-purple-100 text-purple-800",
    espresso: "bg-red-100 text-red-800",
    chemex: "bg-orange-100 text-orange-800",
    moka: "bg-yellow-100 text-yellow-800",
    turkish: "bg-pink-100 text-pink-800",
    cold_brew: "bg-cyan-100 text-cyan-800",
  };
  return colors[method] || "bg-gray-100 text-gray-800";
}

export function formatBrewDateTime(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatBrewDuration(seconds: number | undefined | null): string {
  if (!seconds) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
