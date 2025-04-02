import { Livro } from "../models/Livro";

const LivroController = {
    async listar(req, res) {
        try {
            const livros = await Livro.findAll();
            return res.json(livros);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao buscar livros" });
        }
    },

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const livro = await Livro.findByPk(id);
            if (!livro) {
                return res.status(404).json({ erro: "Livro não encontrado" });
            }
            return res.json(livro);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao buscar livro" });
        }
    },

    async cadastrar(req, res) {
        try {
            const livro = await Livro.create(req.body);
            return res.status(201).json(livro);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao cadastrar livro" });
        }
    },

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const livro = await Livro.findByPk(id);
            if (!livro) {
                return res.status(404).json({ erro: "Livro não encontrado" });
            }
            await livro.update(req.body);
            return res.json(livro);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao atualizar livro" });
        }
    },

    async deletar(req, res) {
        try {
            const { id } = req.params;
            const livro = await Livro.findByPk(id);
            if (!livro) {
                return res.status(404).json({ erro: "Livro não encontrado" });
            }
            await livro.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao deletar livro" });
        }
    },

    async listarDisponiveis(req, res) {
        try {
            const livros = await Livro.findAll({ where: { disponivel: true } });
            return res.json(livros);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao buscar livros disponíveis" });
        }
    }
};

export { LivroController };
