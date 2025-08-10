-- DropForeignKey
ALTER TABLE "organization" DROP CONSTRAINT "organization_boardId_fkey";

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
