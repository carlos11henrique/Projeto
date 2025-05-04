import { Emprestimo } from '../models/modelsEmprestimo.js';

const EmprestimoController = {
    async listar(req, res) {
        try {
            const emprestimos = await Emprestimo.findAll();
            return res.json(emprestimos);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao buscar empréstimos" });
        }
    },

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const emprestimo = await Emprestimo.findByPk(id);
            if (!emprestimo) {
                return res.status(404).json({ erro: "Empréstimo não encontrado" });
            }
            return res.json(emprestimo);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao buscar empréstimo" });
        }
    },

    async emprestar(req, res) {
        try {
            const { usuarioId, livroId, dataEmprestimo, dataDevolucaoPrevista } = req.body;
            const novoEmprestimo = await Emprestimo.create({ 
                usuarioId, 
                livroId, 
                dataEmprestimo: dataEmprestimo || new Date(), 
                dataDevolucaoPrevista 
            });
            return res.status(201).json(novoEmprestimo);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao registrar empréstimo" });
        }
    },

    async devolver(req, res) {
        try {
            const { id } = req.params;
            const emprestimo = await Emprestimo.findByPk(id);
            if (!emprestimo) {
                return res.status(404).json({ erro: "Empréstimo não encontrado" });
            }
            await emprestimo.update({ dataDevolucao: new Date() });
            return res.json({ mensagem: "Livro devolvido com sucesso" });
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao registrar devolução" });
        }
    },

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { usuarioId, livroId, dataEmprestimo, dataDevolucaoPrevista, dataDevolucao } = req.body;
            const emprestimo = await Emprestimo.findByPk(id);
            if (!emprestimo) {
                return res.status(404).json({ erro: "Empréstimo não encontrado" });
            }
            await emprestimo.update({ usuarioId, livroId, dataEmprestimo, dataDevolucaoPrevista, dataDevolucao });
            return res.json(emprestimo);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao atualizar empréstimo" });
        }
    },

    async deletar(req, res) {
        try {
            const { id } = req.params;
            const emprestimo = await Emprestimo.findByPk(id);
            if (!emprestimo) {
                return res.status(404).json({ erro: "Empréstimo não encontrado" });
            }
            await emprestimo.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao deletar empréstimo" });
        }
    }
};

export default EmprestimoController;
