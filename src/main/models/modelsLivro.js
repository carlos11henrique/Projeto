import { Sequelize } from "sequelize";

Sequelize('Livro', {
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