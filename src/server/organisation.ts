import { getUser } from "@/lib/auth-server";
import prisma from "@/lib/prisma";

export async function getOrganizations() {
  const user = await getUser();

  const members = await prisma.member.findMany({
    where: {
      userId: user.id,
    },
  });

  const organizations = await prisma.organization.findMany({
    where: {
      id: {
        in: members.map((member) => member.organizationId),
      },
    },
  });

  return organizations;
}
