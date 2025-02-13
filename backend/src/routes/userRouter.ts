import express from "express";
import createUserController from "../controllers/user/createUsuarioController";
import getUsuarioController from "../controllers/user/getUsuarioController";
import deleteUsuarioController from "../controllers/user/deleteUsuarioController";
import {login} from "../controllers/user/loginUsuarioController";
import {isAuthenticate}  from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create", createUserController.createUser);

router.get("/getCPF",isAuthenticate ,getUsuarioController.getUserByCPF);

router.get("/email/:email",isAuthenticate ,getUsuarioController.getUserByEmail);

router.get("/getPrefeitura",isAuthenticate , getUsuarioController.getUsersByPrefeitura);

router.get("/getAll",isAuthenticate , getUsuarioController.getAllUsers)

router.delete("/delete",isAuthenticate , deleteUsuarioController.deleteUser);

router.post("/login", login);



export default router;