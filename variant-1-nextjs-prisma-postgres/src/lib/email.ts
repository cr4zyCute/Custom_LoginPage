import { createTransport } from "nodemailer";
import { prisma } from "@/lib/prisma";

export async function sendEmail(to: string, templateName: string, replacements: Record<string, string>) {
  const template = await prisma.emailTemplate.findUnique({
    where: { name: templateName }
  });

  // Fallback defaults if template is missing
  let subject = template?.subject || "Notification";
  let html = template?.htmlContent || "";
  let text = template?.textContent || "";

  // If no template found and no content, we can't send
  if (!template && !html) {
    console.warn(`Template ${templateName} not found and no fallback content provided.`);
    return;
  }

  // Apply replacements
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    subject = subject.replace(regex, value);
    html = html.replace(regex, value);
    text = text.replace(regex, value);
  });

  const transport = createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD
    }
  });

  await transport.sendMail({
    to,
    from: process.env.EMAIL_FROM,
    subject,
    html,
    text: text || html.replace(/<[^>]*>?/gm, '') // Simple HTML to text fallback
  });
}
