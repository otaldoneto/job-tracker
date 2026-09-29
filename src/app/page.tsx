import { prisma } from "@/lib/prisma";
import { BoardLoader } from "@/components/BoardLoader";

export default async function Home() {
  const applications = await prisma.application.findMany({
    orderBy: { position: "asc" },
  });

  return <BoardLoader initialApplications={applications} />;
}
