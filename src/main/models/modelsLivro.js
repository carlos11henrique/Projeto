import { DataTypes } from "sequelize";
/**
 * Cria o modelo de Livro no banco de dados
 * @param {Sequelize} sequelize - Inst ncia do Sequelize
 * @returns {Sequelize.Model} - O modelo de Livro
 */
export function createModel(sequelize) {
  const Livro = sequelize.define('Livro', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codigoLivro: {
      type: DataTypes.STRING,
      allowNull: false
    },
    editora: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genero: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imagem: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Livro;
}
