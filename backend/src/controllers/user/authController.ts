// import express from 'express';
// import { generateResetToken, resetPassword } from '../../services/user/authService';

// const routerAuth = express.Router();

// /**
//  * Rota para solicitar redefinição de senha (envia e-mail)
//  */
// routerAuth.post('/forgot-password', async (req, res) => {
//   try {
//     const { email } = req.body;
//     const response = await generateResetToken(email);
//     res.status(200).json(response);
//   } catch (error: any) {
//     console.error("Erro ao gerar token:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// /**
//  * Rota para redefinir a senha com um token
//  */
// routerAuth.post('/reset-password', async (req, res) => {
//   try {
//     const { token, novaSenha } = req.body;
//     const response = await resetPassword(token, novaSenha);
//     res.status(200).json(response);
//   } catch (error: any) {
//     console.error("Erro ao redefinir senha:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// export default routerAuth;