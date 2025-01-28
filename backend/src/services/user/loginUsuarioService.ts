import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

export const loginUser = async (cpf: string, senha: string) => {
  // Busca o usuário pelo CPF, incluindo os dados da prefeitura
  const user = await prisma.usuarios.findUnique({
    where: { cpf },
    select: {
      id: true,
      cpf: true,
      nome: true,
      senha: true,
      permissoes: true,
      prefeituraId: true, // Incluindo prefeituraId na consulta
      prefeitura: {
        select: {
          cidade: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const isPasswordValid = await bcrypt.compare(senha, user.senha);
  if (!isPasswordValid) {
    throw new Error("Senha inválida");
  }

  const token = jwt.sign(
    {
      id: user.id,
      cpf: user.cpf,
      prefeituraId: user.prefeituraId, 
      nome: user.nome,
      permissoes: user.permissoes,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user.id,
      cpf: user.cpf,
      nome: user.nome,
      prefeituraId: user.prefeituraId, 
      permissoes: user.permissoes,
      prefeitura: user.prefeitura
        ? {
            cidade: user.prefeitura.cidade,
            dataCriacao: user.prefeitura.createdAt,
          }
        : null,
    },
  };
};