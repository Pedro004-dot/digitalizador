import nodemailer from 'nodemailer';
import { generateSignedUrl } from '../aws/viewArquivo';

/**
 * Envia um e-mail com o link para um arquivo.
 * @param email - Endereço de e-mail do destinatário
 * @param fileName - Nome do arquivo no S3
 */
export const sendEmailWithFileLink = async (email: string, fileName: string): Promise<void> => {
  if (!email || !fileName) {
    throw new Error("E-mail e nome do arquivo são obrigatórios.");
  }

  // Gerar a URL assinada para o arquivo
  const url = await generateSignedUrl(fileName);

  // Configurar o transporte do Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Substitua pelo serviço que você usa
    auth: {
      user: process.env.EMAIL_USER, // Seu e-mail
      pass: process.env.EMAIL_PASSWORD, // Sua senha ou app password
    },
  });

  // Configurar o e-mail
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Link para o arquivo: ${fileName}`,
    text: `Olá, segue o link para visualizar o arquivo:\n\n${url}\n\nEste link é válido por 1 hora.`,
  };

  // Enviar o e-mail
  await transporter.sendMail(mailOptions);
};