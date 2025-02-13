/*
  Warnings:

  - The primary key for the `Documento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Documento` table. All the data in the column will be lost.
  - You are about to drop the column `s3Key` on the `Documento` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Documento` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Documento` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chave` to the `Documento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Documento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Documento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sobrenome` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Documento" DROP CONSTRAINT "Documento_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "s3Key",
DROP COLUMN "text",
DROP COLUMN "title",
ADD COLUMN     "chave" TEXT NOT NULL,
ADD COLUMN     "datacriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Documento_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Documento_id_seq";

-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "sobrenome" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");
