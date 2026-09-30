import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BoardLoader } from "@/components/BoardLoader";

export default async function Home() {
  const applications = await prisma.application.findMany({
    orderBy: { position: "asc" },
  });

  return (
    <div>
      <div className="flex justify-end p-4">
        <Link href="/stats" className="text-sm text-gray-500 hover:text-gray-800">
          Ver estatísticas →
        </Link>
      </div>
      <BoardLoader initialApplications={applications} />
    </div>
  );
}
