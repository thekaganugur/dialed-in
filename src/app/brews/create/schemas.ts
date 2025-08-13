import { z } from "zod";

export const createBrewFormSchema = z.object({
  beanId: z.string().min(1, "Please select a coffee bean"),
  method: z.string().min(1, "Please select a brew method"),
  doseGrams: z.string().optional(),
  yieldGrams: z.string().optional(),
  brewTimeSeconds: z.string().optional(),
  waterTempCelsius: z.string().optional(),
  grindSetting: z.string().optional(),
  rating: z.string().min(1, "Please rate your brew"),
  notes: z.string().optional(),
  flavorNotes: z.string().optional(),
});
