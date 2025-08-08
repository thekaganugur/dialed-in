import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMethodBadgeColor(method: string): string {
  const methodColors: Record<string, string> = {
    'Espresso': 'bg-espresso text-white',
    'V60': 'bg-arabica text-white',
    'French Press': 'bg-blue-600 text-white',
    'Aeropress': 'bg-red-600 text-white',
    'Chemex': 'bg-green-600 text-white',
    'Pour Over': 'bg-purple-600 text-white',
  };
  
  return methodColors[method] || 'bg-gray-600 text-white';
}

export function renderStars(rating: number): string {
  const stars = Math.round(rating);
  const fullStars = '★'.repeat(stars);
  const emptyStars = '☆'.repeat(5 - stars);
  return fullStars + emptyStars;
}
