"use server";

import { db } from "@/lib/db";
import { coffeeBeans, type NewCoffeeBean } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createBeanFormSchema } from "./schemas";

export async function createBean(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = createBeanFormSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error);
    throw new Error(`Invalid Inputs: ${JSON.stringify(validatedFields.error)}`);
  }

  const data = validatedFields.data;

  const newBean: NewCoffeeBean = {
    userId: session.user.id,
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
  revalidatePath("/");
  redirect("/beans");
}