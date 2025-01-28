import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const deletePrefeitura = async (id: string) => {
  const prefeitura = await prisma.prefeituras.findUnique({ where: { id } });

  if (!prefeitura) {
    throw new Error("Prefeitura não encontrada.");
  }

  await prisma.prefeituras.delete({ where: { id } });

  return { message: "Prefeitura deletada com sucesso." };
};

export default { deletePrefeitura };