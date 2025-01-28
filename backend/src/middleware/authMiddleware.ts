import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Payload {
  id: string;
  cpf: string;
  prefeituraId: string;
  nome: string;
  permissoes: string;
}

export const isAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    res.status(401).json({ message: "Token não fornecido" });
    return;
  }

  const [, token] = authToken.split(" ");

  try {
    // Decodificar o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Payload;

    // Buscar informações adicionais da prefeitura no banco de dados
    const prefeitura = await prisma.prefeituras.findUnique({
      where: {
        id: decoded.prefeituraId,
      },
      select: {
        cidade: true,
        createdAt: true,
      },
    });

    if (!prefeitura) {
      res.status(404).json({ message: "Prefeitura não encontrada" });
      return;
    }

    // Adiciona as informações do usuário e da prefeitura no objeto `req.user`
    req.user = {
      id: decoded.id,
      cpf: decoded.cpf,
      prefeituraId: decoded.prefeituraId,
      nome: decoded.nome,
      permissoes: decoded.permissoes,
      prefeitura: {
        cidade: prefeitura.cidade,
        createdAt: prefeitura.createdAt,
      },
    };

    // Validação do acesso à prefeitura
    const { prefeituraId } = req.params;
    if (prefeituraId && prefeituraId !== decoded.prefeituraId) {
      res.status(403).json({ message: "Acesso não autorizado para essa prefeitura." });
      return;
    }

    next(); // Continua para a próxima função middleware ou rota
  } catch (error) {
    console.error("Erro no middleware isAuthenticate:", error);
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
};