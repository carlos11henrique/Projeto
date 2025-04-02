import { DataTypes } from "sequelize";

export function createModel(sequelize) {
  const Emprestimo = sequelize.define('Emprestimo', {
id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    livroId: {
      type: DataTypes.INTEGER,
      references: {
        model: Livro,
        key: 'id'
      }
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      references: {
        model: Usuario,
        key: 'id'
      }
    },
    dataEmprestimo: {
      type: DataTypes.DATE
    },
    dataDevolucao: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING
    }
    });

  return Emprestimo;
}