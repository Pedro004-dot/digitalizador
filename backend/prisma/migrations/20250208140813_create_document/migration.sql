/*
  Warnings:

  - The primary key for the `Documento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chave` on the `Documento` table. All the data in the column will be lost.
  - You are about to drop the column `datacriacao` on the `Documento` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Documento` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Documento` table. All the data in the column will be lost.
  - The `id` column on the `Documento` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `s3Key` to the `Documento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Documento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Documento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Documento" DROP CONSTRAINT "Documento_pkey",
DROP COLUMN "chave",
DROP COLUMN "datacriacao",
DROP COLUMN "nome",
DROP COLUMN "url",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "s3Key" TEXT NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Documento_pkey" PRIMARY KEY ("id");
