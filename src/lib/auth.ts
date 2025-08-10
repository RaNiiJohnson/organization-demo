import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    organization({
      organizationDeletion: {
        disabled: false,
        afterDelete: async ({ organization }, request) => {
          await prisma.board.deleteMany({
            where: { organizationId: organization.id },
          });
        },
      },
    }),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
