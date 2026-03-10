"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ThemeConfig } from "@/types/theme";

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

export async function updateThemeBackground(themeId: string, backgroundUrl: string) {
  try {
    const theme = await prisma.theme.findUnique({ where: { id: themeId } });
    if (!theme) return { success: false, error: "Theme not found" };

    let config: ThemeConfig;
    try {
      config = JSON.parse(theme.config) as ThemeConfig;
    } catch (e) {
      console.error("Failed to parse theme config:", e);
      return { success: false, error: "Invalid theme configuration" };
    }

    // Ensure assets object exists
    if (!config.assets) {
      config.assets = {};
    }

    config.assets.backgroundImage = backgroundUrl;
    // Also update sidebar image to match, so the theme looks consistent
    config.assets.sidebarImage = backgroundUrl;

    // If darkAssets exists, update it too to ensure consistency when user explicitly changes background
    if (config.darkAssets) {
        config.darkAssets.backgroundImage = backgroundUrl;
        config.darkAssets.sidebarImage = backgroundUrl;
    }

    await prisma.theme.update({
      where: { id: themeId },
      data: { config: JSON.stringify(config) },
    });

    revalidatePath("/admin/themes");
    revalidatePath("/");
    revalidatePath("/login");

    return { success: true };
  } catch (error) {
    console.error("Failed to update theme background:", error);
    return { success: false, error: "Database update failed" };
  }
}
