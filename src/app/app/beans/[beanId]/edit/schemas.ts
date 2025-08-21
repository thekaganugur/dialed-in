import { processEnum, roastLevelEnum } from "@/lib/db/schema";
import { z } from "zod";

export const editBeanFormSchema = z.object({
  name: z.string().min(1, "Bean name is required").max(255, "Name too long"),
  roaster: z.string().max(255, "Roaster name too long").optional(),
  origin: z.string().max(255, "Origin name too long").optional(),
  roastLevel: z.enum(roastLevelEnum.enumValues).optional(),
  process: z.enum(processEnum.enumValues).optional(),
  roastDate: z.string().date("Invalid date format").optional().or(z.literal("")),
  notes: z.string().optional(),
});

export type EditBeanFormData = z.infer<typeof editBeanFormSchema>;