"use server";

import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { coffeeLogs } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { editBrewFormSchema } from "./schemas";

export async function updateBrew(brewId: string, formData: FormData) {
  const session = await requireAuth();

  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = editBrewFormSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error);
    throw new Error(`Invalid Inputs: ${JSON.stringify(validatedFields.error)}`);
  }

  const data = validatedFields.data;

  // Only allow updating user's own brews
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
    .where(
      and(eq(coffeeLogs.id, brewId), eq(coffeeLogs.userId, session.user.id)),
    );

  revalidatePath("/app/brews");
  revalidatePath("/app");
  revalidatePath(`/app/brews/${brewId}`);
  redirect(`/app/brews/${brewId}`);
}
