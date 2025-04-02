import { Sequelize } from "sequelize";
import { DEST_USER, DEST_DB } from "../util/caminho";
import Livro from "./Livro";
import Emprestimo from "./Emprestimo";
import Usuario from "./Usuario";

Livro.hasMany(Emprestimo);
Emprestimo.belongsTo(Livro);

Usuario.hasMany(Emprestimo);
Emprestimo.belongsTo(Usuario);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DEST_DB
});

export { Livro, Emprestimo, Usuario, sequelize };