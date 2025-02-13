import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import bcrypt from "bcrypt";
import sendEmail from "../../utils/emailService";

const prisma = new PrismaClient();

/**
 * Gera um código OTP para redefinição de senha e envia via e-mail.
 */
export const generateResetToken = async (email: string) => {
    const user = await prisma.usuarios.findUnique({
      where: { email },
    });
  
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
  
    // 🔹 Garante que o token nunca será `undefined`
    const resetToken = crypto.randomBytes(3).toString("hex").toUpperCase(); // Ex: "A1B2C3"
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 🔹 Expira em 10 minutos
  
    // 🔹 Atualiza o usuário com o token e a data de expiração
    const updatedUser = await prisma.usuarios.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires: expiresAt,
      },
    });
  
    // 🔹 Verificação extra para debug
    console.log("✅ Token gerado:", updatedUser.resetToken);
    console.log("✅ Expiração:", updatedUser.resetTokenExpires);
  
    // 🔹 Envia e-mail com o código
    await sendEmail(user.email, "Código de Redefinição de Senha", `Seu código: ${resetToken}`);
  
    return { message: "Código enviado para seu e-mail!" };
  };

/**
 * Valida o código OTP e redefine a senha do usuário.
 */
export const resetPassword = async (email: string, token: string, novaSenha: string) => {
  const user = await prisma.usuarios.findFirst({
    where: {
      email,
      resetToken: token,
      resetTokenExpires: { gte: new Date() }, // 🔹 Verifica se ainda é válido
    },
  });

  if (!user) {
    throw new Error("Código inválido ou expirado.");
  }

  // 🔹 Criptografa a nova senha
  const hashedPassword = await bcrypt.hash(novaSenha, 10);

  // 🔹 Atualiza a senha no banco e apaga o token
  await prisma.usuarios.update({
    where: { id: user.id },
    data: {
      senha: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    },
  });

  // 🔹 Notifica o usuário que a senha foi alterada
  await sendEmail(user.email, "Senha Alterada", "Sua senha foi redefinida com sucesso.");

  return { message: "Senha alterada com sucesso!" };
};