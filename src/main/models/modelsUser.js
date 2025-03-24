import { Sequelize } from "sequelize";

sequelize('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('Aluno', 'Professor', 'Adm'),
      allowNull: false
    },
    serie: {
      type: DataTypes.STRING,
      allowNull: true, // Este campo é opcional para 'Professor' e 'Adm'
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
    tableName: 'Usuarios',  // Nome da tabela no banco de dados
  });