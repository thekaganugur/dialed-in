import type { fetchBrewById } from "@/lib/db/data";

type BrewData = NonNullable<Awaited<ReturnType<typeof fetchBrewById>>>;

export interface DuplicateBrewData {
  beanId: string;
  method: string;
  doseGrams: string;
  yieldGrams: string;
  brewTimeSeconds: string;
  waterTempCelsius: string;
  grindSetting: string;
  originalBrewName: string;
  originalBrewDate: Date;
}

const brewMethodDefaults = {
  espresso: {
    doseGrams: "18",
    yieldGrams: "36", 
    brewTimeSeconds: "30",
    waterTempCelsius: "93",
  },
  v60: {
    doseGrams: "20",
    yieldGrams: "320",
    brewTimeSeconds: "180", 
    waterTempCelsius: "96",
  },
  aeropress: {
    doseGrams: "17",
    yieldGrams: "250",
    brewTimeSeconds: "120",
    waterTempCelsius: "85",
  },
  french_press: {
    doseGrams: "30", 
    yieldGrams: "500",
    brewTimeSeconds: "240",
    waterTempCelsius: "95",
  },
  chemex: {
    doseGrams: "25",
    yieldGrams: "400",
    brewTimeSeconds: "300",
    waterTempCelsius: "96", 
  },
  moka: {
    doseGrams: "20",
    yieldGrams: "200", 
    brewTimeSeconds: "300",
    waterTempCelsius: "90",
  },
  turkish: {
    doseGrams: "10",
    yieldGrams: "100",
    brewTimeSeconds: "180",
    waterTempCelsius: "95",
  },
  cold_brew: {
    doseGrams: "100",
    yieldGrams: "1000",
    brewTimeSeconds: "43200",
    waterTempCelsius: "22",
  },
} as const;

/**
 * Get default brewing parameters for a given method
 */
export function getBrewMethodDefaults(method: string) {
  return brewMethodDefaults[method as keyof typeof brewMethodDefaults] || null;
}

/**
 * Calculate brew ratio from dose and yield
 */
export function calculateBrewRatio(dose: number, yield_: number): number {
  return dose > 0 ? yield_ / dose : 0;
}

/**
 * Pure function to transform existing brew data for duplication
 * Resets timestamp-dependent fields (rating, notes) while preserving brewing parameters
 */
export function transformBrewForDuplication(brew: BrewData): DuplicateBrewData {
  return {
    beanId: brew.log.beanId,
    method: brew.log.method,
    doseGrams: brew.log.doseGrams?.toString() || "",
    yieldGrams: brew.log.yieldGrams?.toString() || "",
    brewTimeSeconds: brew.log.brewTimeSeconds?.toString() || "",
    waterTempCelsius: brew.log.waterTempCelsius?.toString() || "",
    grindSetting: brew.log.grindSetting || "",
    originalBrewName: brew.bean.name,
    originalBrewDate: brew.log.brewedAt,
  };
}