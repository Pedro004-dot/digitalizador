import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getDocumentosByUsuario = async (usuarioId: string) => {
  return await prisma.documento.findMany({
    where: {
      usuarioid: usuarioId,
    },
    orderBy: {
      datacriacao: 'desc', // Ordena por data de criação (descendente)
    },
  });
};

const getDocumentosByPrefeitura = async (prefeituraId: string) => {
  return await prisma.documento.findMany({
    where: {
      prefeituraid: prefeituraId,
    },
    orderBy: {
      datacriacao: 'desc', // Ordena por data de criação (descendente)
    },
  });
};


  const getDocumentoByNome = async (nome: string) => {
    return await prisma.documento.findFirst({
      where: {
        nome: {
          equals: nome, // Busca exata (caso-insensitive por padrão no PostgreSQL)
          mode: 'insensitive',
        },
      },
    });
  };

export default {
  getDocumentosByUsuario,
  getDocumentosByPrefeitura,
  getDocumentoByNome,
};