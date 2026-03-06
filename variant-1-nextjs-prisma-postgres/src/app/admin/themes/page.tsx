
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ThemesGrid } from "./themes-grid";

async function activateTheme(formData: FormData) {
  "use server";
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

export default async function AdminThemesPage() {
  const themes = await prisma.theme.findMany({
    orderBy: { category: "asc" },
  });

  const activeTheme = themes.find((t) => t.isActive);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Theme Manager</h1>
      
      <div className="mb-8 p-4 bg-muted rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Current Active Theme</h2>
        {activeTheme ? (
          <div className="flex items-center gap-4">
            <span className="font-bold text-primary text-lg">{activeTheme.name}</span>
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
              {activeTheme.category} • {activeTheme.layout}
            </span>
          </div>
        ) : (
          <span className="text-destructive font-medium">No active theme selected</span>
        )}
      </div>

      <ThemesGrid themes={themes} activateAction={activateTheme} />
    </div>
  );
}
