import { DataTypes } from "sequelize";

export function CategoriaModel(sequelize) {
  const Categoria = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  });

  return Categoria;
}
