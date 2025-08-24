"use server";

import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { grinders } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createGrinderSchema = z.object({
  displayName: z.string().min(1, "Grinder name is required").max(100),
  brand: z.string().max(50).optional(),
  model: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
});

export async function createGrinder(data: z.infer<typeof createGrinderSchema>) {
  const validatedData = createGrinderSchema.parse(data);
  const session = await requireAuth();

  const cleanData = {
    displayName: validatedData.displayName.trim(),
    brand: validatedData.brand?.trim() || undefined,
    model: validatedData.model?.trim() || undefined,
    notes: validatedData.notes?.trim() || undefined,
  };

  const existingGrinder = await db.query.grinders.findFirst({
    where: (grinders, { and, eq }) =>
      and(
        eq(grinders.userId, session.user.id),
        eq(grinders.displayName, cleanData.displayName),
        eq(grinders.isActive, true),
      ),
  });
  if (existingGrinder) {
    throw new Error("You already have a grinder with this name");
  }

  const [newGrinder] = await db
    .insert(grinders)
    .values({
      userId: session.user.id,
      displayName: cleanData.displayName,
      brand: cleanData.brand,
      model: cleanData.model,
      notes: cleanData.notes,
      isBuiltIn: false,
      isActive: true,
    })
    .returning();

  revalidatePath("/app/brews/create");
  revalidatePath("/app/brews/[brewId]/edit");

  return newGrinder;
}

// Simple wrapper for quick grinder creation with just a name
export async function createGrinderByName(displayName: string) {
  return await createGrinder({ displayName });
}

// export async function updateGrinder(grinderId: string, formData: FormData) {
//   const session = await requireAuth();
//
//   const rawData = {
//     displayName: formData.get("displayName"),
//     brand: formData.get("brand"),
//     model: formData.get("model"),
//     notes: formData.get("notes"),
//   };
//
//   const validatedData = createGrinderSchema.parse(rawData);
//
//   const cleanData = {
//     displayName: validatedData.displayName.trim(),
//     brand: validatedData.brand?.trim() || undefined,
//     model: validatedData.model?.trim() || undefined,
//     notes: validatedData.notes?.trim() || undefined,
//   };
//
//   // Check ownership and that grinder exists
//   const existingGrinder = await db.query.grinders.findFirst({
//     where: (grinders, { and, eq }) => and(
//       eq(grinders.id, grinderId),
//       eq(grinders.userId, session.user.id),
//       eq(grinders.isActive, true)
//     ),
//   });
//
//   if (!existingGrinder) {
//     throw new Error("Grinder not found or you don't have permission to edit it");
//   }
//
//   // Update the grinder
//   await db.update(grinders)
//     .set(cleanData)
//     .where((t) => eq(t.id, grinderId));
//
//   revalidatePath("/app/brews/create");
//   revalidatePath("/app/brews/[brewId]/edit");
// }

// export async function deleteGrinder(grinderId: string) {
//   const session = await requireAuth();
//
//   // Check ownership
//   const existingGrinder = await db.query.grinders.findFirst({
//     where: (grinders, { and, eq }) => and(
//       eq(grinders.id, grinderId),
//       eq(grinders.userId, session.user.id),
//       eq(grinders.isBuiltIn, false) // Can't delete built-in grinders
//     ),
//   });
//
//   if (!existingGrinder) {
//     throw new Error("Grinder not found or you don't have permission to delete it");
//   }
//
//   // Soft delete (set isActive to false)
//   await db.update(grinders)
//     .set({ isActive: false })
//     .where((t) => eq(t.id, grinderId));
//
//   revalidatePath("/app/brews/create");
//   revalidatePath("/app/brews/[brewId]/edit");
// }
