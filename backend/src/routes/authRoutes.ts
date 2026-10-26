import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { userRoutes } from './userRoutes';

const router = Router();

// rota publica de login
router.post('/login', AuthController.login);

// registra as rotas de usuarios sob o prefico /users
router.use('/users', userRoutes);

export { router as authRoutes };
