import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreatePrefeituraInput {
  cidade: string;
}

const createPrefeitura = async (data: CreatePrefeituraInput) => {
  const { cidade } = data;

  const novaPrefeitura = await prisma.prefeituras.create({
    data: {
      cidade,
    },
  });

  return novaPrefeitura;
};

export default { createPrefeitura };