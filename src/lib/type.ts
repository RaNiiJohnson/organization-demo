import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string(),
  content: z.string(),
  position: z.number(),
  columnId: z.string(),
});

export const ColumnSchema = z.object({
  id: z.string(),
  title: z.string(),
  position: z.number(),
  tasks: z.array(TaskSchema),
});

export const BoardSchema = z.object({
  id: z.string(),
  title: z.string(),
  columns: z.array(ColumnSchema),
});

export type Task = z.infer<typeof TaskSchema>;
export type Column = z.infer<typeof ColumnSchema>;
export type Board = z.infer<typeof BoardSchema>;

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // autres champs éventuels omis
};

export type Member = {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: Date;
  user: User; // Relation incluse
};

export type Organization = {
  id: string;
  name: string;
  slug?: string | null;
  logo?: string | null;
  createdAt: Date;
  metadata?: string | null;
  boardId?: string | null;
  members: Member[];
} | null;
