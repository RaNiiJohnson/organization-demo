"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { actionUser } from "@/lib/safe-ation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

const BoardFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
});

export const addBoardSafeAction = actionUser
  .inputSchema(BoardFormSchema)
  .action(async ({ parsedInput: Input, ctx }) => {
    const baseSlug = Input.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const slug = (await prisma.organization.findUnique({
      where: { slug: baseSlug },
    }))
      ? `${baseSlug}-${crypto.randomUUID().split("-")[0]}`
      : baseSlug;

    const organisation = await auth.api.createOrganization({
      body: {
        name: `${Input.title} Organization`,
        slug,
        keepCurrentActiveOrganization: false,
      },
      headers: await headers(),
    });

    if (!organisation) {
      throw new Error("error : something went wrong");
    }

    const newBoard = await prisma.board.create({
      data: {
        title: Input.title,
        userId: ctx.user.id,
        organizationId: organisation.id,
        columns: {
          create: [
            { title: "To Do 📌", position: 1 },
            { title: "Doing 🛠️", position: 2 },
            { title: "Done 🏁", position: 3 },
          ],
        },
      },
      include: { columns: true },
    });
    revalidatePath("/");
    return { newBoard, organisation };
  });
