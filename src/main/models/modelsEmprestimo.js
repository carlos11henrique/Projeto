import { DataTypes } from "sequelize";

/**
 * Cria o modelo de Emprestimo no banco de dados
 * @param {Sequelize} sequelize - Inst ncia do Sequelize
 * @returns {Sequelize.Model} - O modelo de Emprestimo
 */
export function EmprestimoModel(sequelize) {
  const Emprestimo = sequelize.define('Loan', {
    
id: {
      type: DataTypes.INTEGER,
      primaryKey: true,

      autoIncrement: true
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