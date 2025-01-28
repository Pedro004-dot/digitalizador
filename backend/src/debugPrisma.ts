import { PrismaClient } from '@prisma/client';

async function debugPrisma() {
  console.log('Inicializando Prisma Client...');
  const prisma = new PrismaClient();

  try {
    console.log('Testando conexão com o Prisma...');
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('Conexão com o banco bem-sucedida:', result);
  } catch (error) {
    console.error('Erro ao conectar ao Prisma:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Prisma Client desconectado.');
  }
}

debugPrisma();