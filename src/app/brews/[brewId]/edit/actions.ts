"use server";

import { db } from "@/lib/db";
import { coffeeLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { editBrewFormSchema } from "./schemas";

export async function updateBrew(brewId: string, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = editBrewFormSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error);
    throw new Error(`Invalid Inputs: ${JSON.stringify(validatedFields.error)}`);
  }

  const data = validatedFields.data;

  await db
    .update(coffeeLogs)
    .set({
      beanId: data.beanId,
      method: data.method,
      doseGrams: data.doseGrams || null,
      yieldGrams: data.yieldGrams || null,
      brewTimeSeconds: data.brewTimeSeconds
        ? parseInt(data.brewTimeSeconds)
        : null,
      waterTempCelsius: data.waterTempCelsius
        ? parseInt(data.waterTempCelsius)
        : null,
      grindSetting: data.grindSetting || null,
      rating: data.rating ? parseInt(data.rating) : null,
      notes: data.notes || null,
      flavorNotes: data.flavorNotes || null,
      updatedAt: new Date(),
    })
    .where(eq(coffeeLogs.id, brewId));

  revalidatePath("/brews");
  revalidatePath("/dashboard");
  revalidatePath(`/brews/${brewId}`);
  redirect(`/brews/${brewId}`);
}