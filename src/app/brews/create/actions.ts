"use server";

import { createBrewFormSchema } from "./schemas";

export async function createBrew(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = createBrewFormSchema.safeParse(rawFormData);
  if (!validatedFields.success) throw new Error("Invalid Inputs");

  console.log("Validated data:", validatedFields.data);
}
