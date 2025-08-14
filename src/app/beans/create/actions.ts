"use server";

import { db } from "@/lib/db";
import { coffeeBeans, type NewCoffeeBean } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createBeanFormSchema } from "./schemas";

export async function createBean(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = createBeanFormSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error);
    throw new Error(`Invalid Inputs: ${JSON.stringify(validatedFields.error)}`);
  }

  const data = validatedFields.data;

  const newBean: NewCoffeeBean = {
    userId: "user_demo_1", // TODO: Replace with actual user ID from auth
    name: data.name,
    roaster: data.roaster || null,
    origin: data.origin || null,
    roastLevel: data.roastLevel || null,
    process: data.process || null,
    roastDate: data.roastDate || null,
    notes: data.notes || null,
  };

  await db.insert(coffeeBeans).values(newBean);

  revalidatePath("/beans");
  revalidatePath("/dashboard");
  redirect("/beans");
}