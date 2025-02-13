import express from "express";
import deletePrefeituraController from "../controllers/prefeituras/deletePrefeituraController";
import createPrefeituraController from "../controllers/prefeituras/createPrefeituraController";
import getPrefeituraController from "../controllers/prefeituras/getPrefeituraController";
import { isAuthenticate } from "../middleware/authMiddleware";


const prefeituraRouter = express.Router();

// Rota para criar uma prefeitura
prefeituraRouter.post("/create" , createPrefeituraController.createPrefeitura);

prefeituraRouter.get("/getById",isAuthenticate , getPrefeituraController.getPrefeituraById);

prefeituraRouter.get("/getByName",isAuthenticate , getPrefeituraController.getPrefeituraByCidade);

prefeituraRouter.get("/allPrefeituras" ,getPrefeituraController.getAllPrefeituras)

prefeituraRouter.delete("/delete",isAuthenticate ,deletePrefeituraController.deletePrefeitura);

export default prefeituraRouter;