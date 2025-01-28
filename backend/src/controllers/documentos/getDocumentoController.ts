import { Request, Response } from "express";
import documentoService from "../../services/documentos/getDocumentoService";
//import logService from "../../services/logs/createLogService";

const getDocumentosByUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usuarioId } = req.params;

    const documentos = await documentoService.getDocumentosByUsuario(usuarioId);

    // await logService.createLog({
    //   acao: "GET_DOCUMENTOS_BY_USUARIO",
    //   usuarioId,
    //   descricao: `Consulta de documentos do usuário ${usuarioId}`,
    // });

    res.status(200).json(documentos);
  } catch (error) {
    console.error("Erro ao buscar documentos por usuário:", error);
    res.status(500).json({ error: "Erro ao buscar documentos por usuário" });
  }
};

const getDocumentosByPrefeitura = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prefeituraId } = req.params;

    const documentos = await documentoService.getDocumentosByPrefeitura(prefeituraId);

    // await logService.createLog({
    //   acao: "GET_DOCUMENTOS_BY_PREFEITURA",
    //   usuarioId: req.user.id, // Assuma que existe um middleware para capturar o usuário logado
    //   descricao: `Consulta de documentos da prefeitura ${prefeituraId}`,
    // });

    res.status(200).json(documentos);
  } catch (error) {
    console.error("Erro ao buscar documentos por prefeitura:", error);
    res.status(500).json({ error: "Erro ao buscar documentos por prefeitura" });
  }
};

const getDocumentoByNome = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome } = req.params;

    const documento = await documentoService.getDocumentoByNome(nome);

    if (!documento) {
      res.status(404).json({ error: "Documento não encontrado" });
      return;
    }

    // await logService.createLog({
    //   acao: "GET_DOCUMENTO_BY_NOME",
    //   usuarioId: req.user.id, // Assuma que existe um middleware para capturar o usuário logado
    //   descricao: `Consulta de documento pelo nome: ${nome}`,
    // });

    res.status(200).json(documento);
  } catch (error) {
    console.error("Erro ao buscar documento por nome:", error);
    res.status(500).json({ error: "Erro ao buscar documento por nome" });
  }
};

export default { 
  getDocumentosByUsuario, 
  getDocumentosByPrefeitura, 
  getDocumentoByNome 
};