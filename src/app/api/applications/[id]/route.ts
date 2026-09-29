import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

const ALLOWED_STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await prisma.application.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    throw error;
  }
}


export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "invalid status" }, { status: 400 });
    }
    data.status = body.status;
  }
  if (body.company !== undefined) data.company = body.company;
  if (body.role !== undefined) data.role = body.role;
  if (body.url !== undefined) data.url = body.url;
  if (body.notes !== undefined) data.notes = body.notes;

  try {
    const application = await prisma.application.update({ where: { id }, data });
    return NextResponse.json(application);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    throw error;
  }
}

