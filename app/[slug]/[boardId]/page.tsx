import { getUser } from "@/lib/auth-server";
import prisma from "@/lib/prisma";

type Pageprops = {
  params: Promise<{ slug: string; boardId: string }>;
};

export default async function Page(props: Pageprops) {
  const { slug, boardId } = await props.params;

  const board = await prisma.board.findUnique({
    where: { id: (await props.params).boardId },
    include: {
      columns: {
        orderBy: { position: "asc" },
        include: {
          tasks: {
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });
  return (
    <div>
      {slug}/{boardId}
    </div>
  );
}
