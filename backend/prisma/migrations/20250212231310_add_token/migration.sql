-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpires" TIMESTAMP(3);
