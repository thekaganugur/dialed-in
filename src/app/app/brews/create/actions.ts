"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { coffeeLogs } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createBrewFormSchema } from "./schemas";

export async function createBrew(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = createBrewFormSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error);
    throw new Error(`Invalid Inputs: ${JSON.stringify(validatedFields.error)}`);
  }

  const data = validatedFields.data;

  await db.insert(coffeeLogs).values({
    userId: session.user.id,
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
  });

  revalidatePath("/app/brews");
  revalidatePath("/app");
  redirect("/app/brews");
}
