import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    // verifica se o token foi enviado no formato "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ erro: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    // Valida a assinatura matematica do token com a chave secreta
    const usuarioDecodificado = jwt.verify(token, JWT_SECRET);

    (req as any).user = usuarioDecodificado;

    return next();
  } catch {
    res.status(401).json({ erro: 'Token Inválido ou Expirado!' });
  }
}
