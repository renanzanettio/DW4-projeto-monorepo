import { Router, Request, Response } from "express";
import { User } from "../models/User";

const router = Router();

// GET /api/users - Listar todos os usuarios
router.get('/', async (req: Request, res: Response) => {
    try {
        const usuarios = await User.findAll({
            attributes: ['id', 'nome', 'email', 'createdAt']
        });
        return res.status(200).json(usuarios);
    }
    catch (error: any) {
        return res.status(500).json({erro: 'Erro ao listar usuarios.', detalhe: error.message})
    }
});

// GET /api/users/:id - Buscar um usuario por ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const usuario = await User.findByPk(Number(id), {
            attributes: ['id', 'nome', 'email', 'createdAt']
        });
        
        if (!usuario) {
            return res.status(404).json({erro: 'Usuário não encontrado.'});
        }

        return res.status(200).json(usuario);
    }
    catch (error: any) {
        return res.status(500).json({erro: 'Erro ao buscar usuario.', detalhe: error.message})
    }
});


// POST /api/users - Cadastrar um novo usuario
router.post('/', async (req: Request, res: Response) => {
    try{

        const { nome, email, senha_hash } = req.body;
        
        if (!nome || !email || !senha_hash) {
            return res.status(400).json({ erro: 'nome, email e senha_hash são obrigatórios.'})
        }

        const novoUsuario = await User.create({nome, email, senha_hash});

        return res.status(201).json(novoUsuario);

    } catch (error: any) {
        return res.status(500).json({erro: 'Erro ao cadastrar usuario.', detalhe: error.message})
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nome, email, senha_hash } = req.body;

        const usuario = await User.findByPk(Number(id));

        if (!usuario) {
            return res.status(404).json({erro: 'Usuário não encontrado.'});
        }

        usuario.nome = nome || usuario.nome;
        usuario.email = email || usuario.email;
        usuario.senha_hash = senha_hash || usuario.senha_hash;

        await usuario.save();

        return res.status(200).json(usuario);
    }
    catch (error: any) {
        return res.status(500).json({erro: 'Erro ao atualizar usuario.', detalhe: error.message})
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const usuario = await User.findByPk(Number(id));

        if (!usuario) {
            return res.status(404).json({erro: 'Usuário não encontrado.'});
        }

        await usuario.destroy();

        return res.status(200).json({mensagem: 'Usuário deletado com sucesso.'});
    }
    catch (error: any) {
        return res.status(500).json({erro: 'Erro ao deletar usuario.', detalhe: error.message})
    }
});

export { router as userRoutes }