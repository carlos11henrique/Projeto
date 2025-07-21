import { DataTypes } from "sequelize";

export function UserModel(sequelize) {
  const Usuario = sequelize.define('User', { 
     id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    matricula: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipo: {
      type: DataTypes.ENUM('Aluno', 'Professor', 'Terceiros'),
      allowNull: false
    },
    turma: {
      type: DataTypes.STRING,
      allowNull: true, 

    },
    serie: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
      status: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
    
  
  });

  return Usuario;

}
