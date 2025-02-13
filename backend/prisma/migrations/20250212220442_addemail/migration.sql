/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sobrenome` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "sobrenome" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");
