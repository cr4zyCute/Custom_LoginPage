"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateEmailTemplate(id: string, data: { subject: string; htmlContent: string }) {
  await prisma.emailTemplate.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/emails");
}
