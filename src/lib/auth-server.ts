import { auth } from "./auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import prisma from "./prisma";
import { error } from "console";

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  return session;
};

export const getUser = async () => {
  const session = await getSession();

  if (!session) {
    throw new Error("error");
  }

  return session.user;
};
export const getUsers = async (organizationId: string) => {
  try {
    const members = await prisma.member.findMany({
      where: {
        organizationId,
      },
    });

    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: members.map((member) => member.userId),
        },
      },
    });

    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};
