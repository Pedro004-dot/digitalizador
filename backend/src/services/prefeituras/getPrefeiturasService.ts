import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getPrefeituraById = async (id: string) => {
  const prefeitura = await prisma.prefeituras.findUnique({
    where: { id },
    include: {
      usuarios: true, // Inclui a relação com os usuários
    },
  });

  if (!prefeitura) {
    throw new Error("Prefeitura não encontrada.");
  }

  return prefeitura;
};

export const getAllPrefeituras = async () => {
  return await prisma.prefeituras.findMany({
    select: {
      id: true,   // 🔹 Retorna apenas o ID
      cidade: true, // 🔹 Retorna apenas o nome da prefeitura
    },
  });
};
const getPrefeituraByCidade = async (cidade: string) => {
  return await prisma.prefeituras.findMany({
    where: {
      cidade: {
        contains: cidade, // Busca parcial (case-insensitive por padrão no Prisma para PostgreSQL)
        mode: 'insensitive',
      },
    },
    include: {
      usuarios: true, // Inclui a relação com os usuários
    },
  });
};

export default { getAllPrefeituras, getPrefeituraById, getPrefeituraByCidade };