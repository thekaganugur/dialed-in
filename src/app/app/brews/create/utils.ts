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