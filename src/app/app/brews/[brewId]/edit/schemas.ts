import { brewMethodEnum } from "@/lib/db/schema";
import { z } from "zod";

export const editBrewFormSchema = z.object({
  beanId: z.string(),
  method: z.enum(brewMethodEnum.enumValues),
  doseGrams: z.string().optional(),
  yieldGrams: z.string().optional(),
  brewTimeSeconds: z.string().optional(),
  waterTempCelsius: z.string().optional(),
  grindSetting: z.string().optional(),
  rating: z.string().optional(),
  notes: z.string().optional(),
  flavorNotes: z.string().optional(),
});