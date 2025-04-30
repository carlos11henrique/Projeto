import { DataTypes } from "sequelize";

export function CategoriaModel(sequelize) {
    const Categoria = sequelize.define('Categoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
});
return Categoria;
}