// criação da instancia do express
// retorna as rotas usando o app

import express, { Request, Response } from 'express';
import cors from 'cors'; // serve para tentar acessar uma rota que esta em outro dominio
import { appRoutes } from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota de Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    mensagem: 'Servidor Backend rodando com sucesso.',
    timestamp: new Date().toISOString(),
  });
});

// Registra todas as rotas da aplicacao sob o prefixo /api
app.use('/api', appRoutes);

// Rota da documentação interativa
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { app };
