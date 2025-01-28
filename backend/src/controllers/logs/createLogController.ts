// import logService from "../../services/logs/createLogService";
// const getDocumentosByUsuario = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { usuarioId } = req.body;
  
//       const documentos = await documentoService.getDocumentosByUsuario(usuarioId);
  
//       await logService.createLog({
//         acao: "GET_DOCUMENTOS_BY_USUARIO",
//         usuarioId,
//         documento: null, // Sem documento específico
//       });
  
//       res.status(200).json(documentos);
//     } catch (error) {
//       console.error("Erro ao buscar documentos por usuário:", error);
//       res.status(500).json({ error: "Erro ao buscar documentos por usuário" });
//     }
//   };