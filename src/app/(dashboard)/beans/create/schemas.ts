import { processEnum, roastLevelEnum } from "@/lib/db/schema";
import { z } from "zod";

export const createBeanFormSchema = z.object({
  name: z.string().min(1, "Bean name is required").max(255, "Name too long"),
  roaster: z.string().max(255, "Roaster name too long").optional(),
  origin: z.string().max(255, "Origin name too long").optional(),
  roastLevel: z.enum(roastLevelEnum.enumValues).optional(),
  process: z.enum(processEnum.enumValues).optional(),
  roastDate: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateBeanFormData = z.infer<typeof createBeanFormSchema>;