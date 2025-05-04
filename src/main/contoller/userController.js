import { Usuario } from "../models/modelsUser.js";

const UsuarioController = {
  async listar(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      return res.json(usuarios);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao buscar usuários" });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }
      return res.json(usuario);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao buscar usuário" });
    }
  },

  async criar(req, res) {
    try {
      const { nome, telefone, cpf, tipo, matricula = null, serie = null, turma = null } = req.body;
      const novoUsuario = await Usuario.create({ nome, telefone, cpf, tipo, matricula, serie, turma });
      return res.status(201).json(novoUsuario);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao criar usuário" });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, telefone, cpf, tipo, matricula = null, serie = null, turma = null } = req.body;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }
      await usuario.update({ nome, telefone, cpf, tipo, matricula, serie, turma });
      return res.json(usuario);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }
      await usuario.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao deletar usuário" });
    }
  }
};

export default UsuarioController;
