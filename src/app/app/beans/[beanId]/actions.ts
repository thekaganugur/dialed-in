"use server";

import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { coffeeBeans } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

export async function deleteBeanWithId(beanId: string) {
  const session = await requireAuth();

  const beanIdSchema = z.uuid();
  const validatedId = beanIdSchema.safeParse(beanId);
  if (!validatedId.success) {
    throw new Error("Invalid bean ID format");
  }

  try {
    await db
      .delete(coffeeBeans)
      .where(
        and(
          eq(coffeeBeans.id, validatedId.data),
          eq(coffeeBeans.userId, session.user.id),
        ),
      );
  } catch {
    throw new Error("Failed to delete bean. Please try again.");
  }

  revalidatePath("/app/beans");
  redirect("/app/beans");
}
