
import { prisma } from "@/lib/prisma";
import { ThemesGrid } from "./themes-grid";
import { activateTheme } from "@/actions/theme-actions";

export const dynamic = 'force-dynamic';

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
