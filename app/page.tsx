import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import Link from "next/link";
import BoardOrgForm from "./Board-org-form";
import OrgList from "./org-list";

export default async function Home() {
  const boards = await prisma.board.findMany();
  const organization = await prisma.organization.findMany();
  return (
    <div>
      <BoardOrgForm />
      {boards.map((board) => (
        <div
          key={board.id}
          className="border-2 flex justify-between border-accent rounded-md p-4 space-y-6 mt-4"
        >
          <Link
            href={`/${
              organization.find((org) => org.id === board.organizationId)?.slug
            }/${board.id}`}
          >
            <h2 className="text-2xl font-bold">{board.title}</h2>
            <p className="text-primary">
              {board.createdAt.toLocaleTimeString()}
            </p>
          </Link>
          <form>
            <Button
              formAction={async () => {
                "use server";
                await prisma.board.delete({
                  where: { id: board.id },
                });
                const orgId = organization.find(
                  (org) => org.id === board.organizationId
                );
                await auth.api.deleteOrganization({
                  body: {
                    organizationId: orgId?.id ?? "",
                  },

                  headers: await headers(),
                });
                revalidatePath("/");
              }}
              variant="outline"
              size="icon"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </form>
          <OrgList />
        </div>
      ))}{" "}
      {/* {organization.map((org) => (
        <div
          key={org.id}
          className="border-2 flex justify-between border-accent rounded-md p-4 space-y-6 mt-4"
        >
          <div>
            <h2 className="text-2xl font-bold">{org.name}</h2>
            <p className="text-primary">{org.createdAt.toLocaleTimeString()}</p>
          </div>
          <form>
            <Button
              formAction={async () => {
                "use server";
                await auth.api.deleteOrganization({
                  body: {
                    organizationId: org.id,
                  },

                  headers: await headers(),
                });
                revalidatePath("/");
              }}
              variant="outline"
              size="icon"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </form>
        </div>
      ))} */}
    </div>
  );
}
