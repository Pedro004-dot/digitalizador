import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getUserByCPF = async (cpf: string) => {
  const usuario = await prisma.usuarios.findUnique({
    where: { cpf },
    include: {
      prefeitura: true, // Inclui a relação com Prefeituras
    },
  });

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  return usuario;
};

const getAllUsers = async () => {
  return await prisma.usuarios.findMany({
    include: {
      prefeitura: true, // Inclui a relação com Prefeituras
    },
  });
};

const getUsersByPrefeitura = async (prefeituraId: string) => {
  return await prisma.usuarios.findMany({
    where: { prefeituraId },
    include: {
      prefeitura: true, // Inclui a relação com Prefeituras
    },
  });
};

export default { getUserByCPF, getAllUsers, getUsersByPrefeitura };