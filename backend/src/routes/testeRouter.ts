import express from 'express';
import { isAuthenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/protectedRoute', isAuthenticate, (req, res) => {
  res.status(200).json({
    message: 'You have access to this protected route!',
    user: req.user, // Assuming `req.user` contains the authenticated user's info
  });
});

export default router;