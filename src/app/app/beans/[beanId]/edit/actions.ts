"use server";

import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { coffeeBeans } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { editBeanFormSchema } from "./schemas";

export async function updateBean(beanId: string, formData: FormData) {
  const session = await requireAuth();

  const beanIdValidation = z.uuid().safeParse(beanId);
  if (!beanIdValidation.success) {
    throw new Error("Invalid bean ID format");
  }

  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = editBeanFormSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error);
    throw new Error(`Invalid Inputs: ${JSON.stringify(validatedFields.error)}`);
  }

  const data = validatedFields.data;

  try {
    const result = await db
      .update(coffeeBeans)
      .set({
        name: data.name,
        roaster: data.roaster || null,
        origin: data.origin || null,
        roastLevel: data.roastLevel || null,
        process: data.process || null,
        roastDate: data.roastDate || null,
        notes: data.notes || null,
      })
      .where(
        and(
          eq(coffeeBeans.id, beanIdValidation.data),
          eq(coffeeBeans.userId, session.user.id),
        ),
      )
      .returning({ id: coffeeBeans.id });

    if (result.length === 0) {
      throw new Error("Bean not found or you don't have permission to edit it");
    }
  } catch (error) {
    console.error("Bean update failed:", {
      error: error instanceof Error ? error.message : "Unknown error",
      beanId: beanIdValidation.data,
      userId: session.user.id,
      timestamp: new Date().toISOString(),
    });
    throw new Error("Failed to update bean. Please try again.");
  }
  revalidatePath("/app/beans");
  revalidatePath("/app");
  revalidatePath(`/app/beans/${beanIdValidation.data}`);
  redirect(`/app/beans/${beanIdValidation.data}`);
}

