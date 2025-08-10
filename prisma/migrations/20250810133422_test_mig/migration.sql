-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_organizationId_fkey";

-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "boardId" TEXT;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
