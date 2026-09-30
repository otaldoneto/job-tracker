import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!ALLOWED_STATUSES.includes(body.status) || !Array.isArray(body.ids)) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  await prisma.$transaction(
    body.ids.map((id: string, index: number) =>
      prisma.application.update({
        where: { id },
        data: { status: body.status, position: index },
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}
