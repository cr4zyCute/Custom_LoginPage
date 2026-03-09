import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EmailTemplatesPage() {
  const templates = await prisma.emailTemplate.findMany();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Email Templates</h1>
      </div>
      
      <div className="grid gap-4">
        {templates.length === 0 ? (
          <p className="text-gray-500">No templates found. Please run the seed script.</p>
        ) : (
          templates.map((template) => (
            <div key={template.id} className="p-4 border rounded-lg flex justify-between items-center bg-card text-card-foreground shadow-sm">
              <div>
                <h2 className="text-xl font-semibold capitalize">{template.name.replace(/_/g, " ")}</h2>
                <p className="text-sm text-muted-foreground">Subject: {template.subject}</p>
              </div>
              <Link href={`/admin/emails/${template.id}`}>
                <Button variant="outline">Edit Template</Button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
