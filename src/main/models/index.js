import { Sequelize } from "sequelize";
import { DEST_USER, DEST_DB } from "../util/caminho";
import { createModel } from "./modelsLivro";
import { Emprestimo } from "./modelsEmprestimo";
import { Usuario } from "./modelsUser";
import fs from "node:fs";
import { fstatSync, fsync } from "node:fs";

Livro.hasMany(Emprestimo);
 Emprestimo.belongsTo(Livro);

Usuario.hasMany(Emprestimo);s
Emprestimo.belongsTo(Usuario);
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DEST_DB
});
console.log(fs.existsSync(DEST_DB))
const Livro = createModel(sequelize);
sequelize.sync();

export { Livro as LivroModel, sequelize };