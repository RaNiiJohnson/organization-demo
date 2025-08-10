import MembersTable from "@/components/members-table";
import prisma from "@/lib/prisma";
import { Kanban } from "lucide-react";

type Pageprops = {
  params: Promise<{ slug: string; boardId: string }>;
};

export default async function Page(props: Pageprops) {
  const { slug, boardId } = await props.params;

  const board = await prisma.board.findUnique({
    where: {
      id: (await props.params).boardId,
    },
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

  const organisation = await prisma.organization.findFirst({
    where: {
      slug,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!organisation) {
    throw new Error("something went wrong");
  }

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold">{board?.title}</h1>
      <div>{organisation.members.map((member) => member.user.name)}</div>
      <MembersTable members={organisation.members} />
    </div>
  );
}
