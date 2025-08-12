/*
  Warnings:

  - You are about to drop the column `boardId` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the `Board` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Column` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email,organizationId]` on the table `invitation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,organizationId]` on the table `member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "BoardVisibility" AS ENUM ('PUBLIC', 'ORGANIZATION', 'PRIVATE');

-- CreateEnum
CREATE TYPE "BoardRole" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_userId_fkey";

-- DropForeignKey
ALTER TABLE "Column" DROP CONSTRAINT "Column_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_columnId_fkey";

-- AlterTable
ALTER TABLE "invitation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "member" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "organization" DROP COLUMN "boardId",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Board";

-- DropTable
DROP TABLE "Column";

-- DropTable
DROP TABLE "Task";

-- CreateTable
CREATE TABLE "board" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "visibility" "BoardVisibility" NOT NULL DEFAULT 'ORGANIZATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "column" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "column_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board_members" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "BoardRole" NOT NULL DEFAULT 'VIEWER',

    CONSTRAINT "board_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board_invites" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "BoardRole" NOT NULL DEFAULT 'VIEWER',
    "token" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "inviterId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "board_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "board_members_boardId_userId_key" ON "board_members"("boardId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "board_invites_token_key" ON "board_invites"("token");

-- CreateIndex
CREATE UNIQUE INDEX "board_invites_boardId_email_key" ON "board_invites"("boardId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "invitation_email_organizationId_key" ON "invitation"("email", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "member_userId_organizationId_key" ON "member"("userId", "organizationId");

-- AddForeignKey
ALTER TABLE "board" ADD CONSTRAINT "board_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board" ADD CONSTRAINT "board_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "column" ADD CONSTRAINT "column_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "column"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_members" ADD CONSTRAINT "board_members_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_invites" ADD CONSTRAINT "board_invites_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
