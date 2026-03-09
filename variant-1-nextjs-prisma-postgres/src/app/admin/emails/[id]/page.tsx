import { prisma } from "@/lib/prisma";
import { EmailEditor } from "./email-editor";
import { notFound } from "next/navigation";

export default async function EditEmailTemplatePage({ params }: { params: { id: string } }) {
  const template = await prisma.emailTemplate.findUnique({
    where: { id: params.id },
  });

  if (!template) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Template: {template.name.replace(/_/g, " ")}</h1>
        <p className="text-muted-foreground mt-2">
          Customize the email content sent to users for {template.name.replace(/_/g, " ").toLowerCase()}.
        </p>
      </div>
      <EmailEditor template={template} />
    </div>
  );
}
