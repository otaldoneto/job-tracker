import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const applications = await prisma.application.findMany({
    orderBy: { position: "asc" },
  });
  return NextResponse.json(applications);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.company || !body.role) {
    return NextResponse.json({ error: "company and role are required" }, { status: 400 });
  }

  const count = await prisma.application.count({ where: { status: "APPLIED" } });

  const application = await prisma.application.create({
    data: {
      company: body.company,
      role: body.role,
      url: body.url ?? null,
      notes: body.notes ?? null,
      status: "APPLIED",
      position: count,
    },
  });

  return NextResponse.json(application, { status: 201 });
}
