"use server";

import { db } from "@/lib/db";
import { coffeeLogs } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

const brewIdSchema = z.uuid();

export async function deleteBrewWithId(id: z.infer<typeof brewIdSchema>) {
  const validatedField = brewIdSchema.safeParse(id);
  if (!validatedField.success) {
    console.error("Validation errors:", validatedField.error);
    throw new Error(`Invalid Inputs: ${JSON.stringify(validatedField.error)}`);
  }

  const data = validatedField.data;

  await db
    .update(coffeeLogs)
    .set({ deletedAt: new Date() })
    .where(and(eq(coffeeLogs.id, data), isNull(coffeeLogs.deletedAt)));

  revalidatePath("/brews");
  redirect("/brews");
}
