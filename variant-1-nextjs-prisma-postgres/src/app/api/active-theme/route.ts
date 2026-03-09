import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const activeTheme = await prisma.theme.findFirst({
      where: {
        isActive: true,
      },
    });

    if (!activeTheme) {
      return NextResponse.json({ error: 'No active theme found' }, { status: 404 });
    }

    return NextResponse.json(activeTheme);
  } catch (error) {
    console.error('Failed to fetch active theme:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
