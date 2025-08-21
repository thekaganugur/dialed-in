"use server";

import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { coffeeLogs } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

const brewIdSchema = z.uuid();

export async function deleteBrewWithId(id: z.infer<typeof brewIdSchema>) {
  const session = await requireAuth();

  const validatedField = brewIdSchema.safeParse(id);
  if (!validatedField.success) {
    throw new Error("Invalid brew ID format");
  }

  const data = validatedField.data;

  // Only allow deletion of user's own brews
  await db
    .update(coffeeLogs)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(coffeeLogs.id, data),
        eq(coffeeLogs.userId, session.user.id),
        isNull(coffeeLogs.deletedAt),
      ),
    );

  revalidatePath("/app/brews");
  redirect("/app/brews");
}

export async function toggleBrewSharing(
  id: z.infer<typeof brewIdSchema>,
  currentIsPublic: boolean,
) {
  const session = await requireAuth();

  const validatedField = brewIdSchema.safeParse(id);
  if (!validatedField.success) {
    return { success: false, isPublic: currentIsPublic };
  }

  try {
    const [result] = await db
      .update(coffeeLogs)
      .set({ isPublic: !currentIsPublic })
      .where(
        and(
          eq(coffeeLogs.id, validatedField.data),
          eq(coffeeLogs.userId, session.user.id),
          isNull(coffeeLogs.deletedAt),
        ),
      )
      .returning({ isPublic: coffeeLogs.isPublic });

    revalidatePath(`/app/brews/${validatedField.data}`);
    return { success: true, isPublic: result.isPublic };
  } catch {
    return { success: false, isPublic: currentIsPublic };
  }
}
