import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return ok to avoid enumeration attacks
      return NextResponse.json({ message: "If account exists, email sent" });
    }

    const token = randomBytes(32).toString("hex");
    const identifier = `RESET:${email}`;
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    await prisma.verificationToken.create({
      data: {
        identifier,
        token,
        expires,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    const host = new URL(baseUrl).host;

    await sendEmail(email, "reset_password", {
      url: resetUrl,
      host,
    });

    return NextResponse.json({ message: "Email sent" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
