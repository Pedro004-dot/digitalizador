import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const deleteUser = async (cpf: string) => {
  const usuario = await prisma.usuarios.findUnique({ where: { cpf } });
  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  await prisma.usuarios.delete({ where: { cpf } });
  return { message: "Usuário deletado com sucesso." };
};

export default { deleteUser };