/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SUPPLIER', 'RETAILER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserType" NOT NULL DEFAULT 'SUPPLIER';

-- DropEnum
DROP TYPE "Role";
