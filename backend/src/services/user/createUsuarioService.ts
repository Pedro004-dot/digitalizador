import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Função para validar CPF
const validarCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === parseInt(cpf[10]);
};

interface CreateUserInput {
  cpf: string;
  nome: string;
  sobrenome: string; // Novo campo
  email: string; // Novo campo
  senha: string;
  prefeituraId: string;
  permissoes?: string;
}

const createUser = async (data: CreateUserInput) => {
  const { cpf, nome, sobrenome, email, senha, prefeituraId, permissoes } = data;

  // 🔍 Verifica se o CPF é válido
  if (!validarCPF(cpf)) {
    throw new Error("O CPF fornecido é inválido.");
  }

  // 🔍 Verifica se o CPF já está cadastrado
  const cpfExistente = await prisma.usuarios.findUnique({ where: { cpf } });
  if (cpfExistente) {
    throw new Error("O CPF já está cadastrado.");
  }

  // 🔍 Verifica se o e-mail já está cadastrado
  const emailExistente = await prisma.usuarios.findUnique({ where: { email } });
  if (emailExistente) {
    throw new Error("O e-mail já está cadastrado.");
  }

  // 🔍 Verifica se a prefeitura informada existe
  if (prefeituraId) {
    const prefeitura = await prisma.prefeituras.findUnique({ where: { id: prefeituraId } });
    if (!prefeitura) {
      throw new Error("A prefeitura associada não foi encontrada.");
    }
  }

  // 🔐 Hash da senha
  const hashedPassword = await bcrypt.hash(senha, 10);

  // ✅ Criação do usuário
  const novoUsuario = await prisma.usuarios.create({
    data: {
      cpf,
      nome,
      sobrenome, 
      email, 
      senha: hashedPassword,
      permissoes: "usuario",
      prefeituraId: prefeituraId || null,
    },
  });

  return novoUsuario;
};

export default { createUser };