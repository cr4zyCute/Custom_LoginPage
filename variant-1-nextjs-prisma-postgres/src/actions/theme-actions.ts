"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function activateTheme(formData: FormData) {
  const themeId = formData.get("themeId") as string;
  if (!themeId) return;

  // Deactivate all themes
  await prisma.theme.updateMany({
    data: { isActive: false },
  });

  // Activate selected theme
  await prisma.theme.update({
    where: { id: themeId },
    data: { isActive: true },
  });

  revalidatePath("/admin/themes");
  revalidatePath("/"); // Update home page
  revalidatePath("/login"); // Update login page
}
