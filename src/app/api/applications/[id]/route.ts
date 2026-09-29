import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const application = await prisma.application.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(application);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await prisma.application.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
