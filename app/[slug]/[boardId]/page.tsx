import AllUsers from "@/components/all-users";
import MembersTable from "@/components/members-table";
import { getUser, getUsers } from "@/lib/auth-server";
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

  const organization = await prisma.organization.findFirst({
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

  if (!organization) {
    throw new Error("something went wrong");
  }

  const users = await getUsers(organization.id);

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold">{board?.title}</h1>
      <div>{organization.members.map((member) => member.user.name)}</div>
      <MembersTable members={organization.members} />
      <AllUsers users={users} organizationId={organization.id || ""} />
    </div>
  );
}
