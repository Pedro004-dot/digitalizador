import express from "express";
import getDocumentoController from "../controllers/documentos/getDocumentoController";
import { isAuthenticate } from "../middleware/authMiddleware";

const documentoRouter = express.Router();

documentoRouter.get('/getDocumentoByNome',isAuthenticate ,getDocumentoController.getDocumentoByNome);

documentoRouter.get('/getDocumentoByPrefeitura',isAuthenticate ,getDocumentoController.getDocumentosByPrefeitura);

documentoRouter.get('/getDocumentoByUsuario',isAuthenticate ,getDocumentoController.getDocumentosByUsuario);

export default documentoRouter