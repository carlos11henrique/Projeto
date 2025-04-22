import { DataTypes } from "sequelize";

export function UserModel(sequelize) {
  const Usuario = sequelize.define('Usuario', { 
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
  unique: true
    },
    tipo: {
      type: DataTypes.ENUM('Aluno', 'Professor', 'Terceiros'),
      allowNull: false
    },
    serie: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true,  
    tableName: 'Usuarios', 
  });

  return Usuario;

}
