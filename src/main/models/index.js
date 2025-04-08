import { Sequelize } from "sequelize";
import { DEST_USER, DEST_DB } from "../util/caminho";
import { createModel } from "./modelsLivro";
import { EmprestimoModel } from "./modelsEmprestimo";
import { UserModel } from "./modelsUser";
import fs from "node:fs";
import { fstatSync, fsync } from "node:fs";

Livro.hasMany(EmprestimoModel);
 Emprestimo.belongsTo(Livro);

 UserModel.hasMany(EmprestimoModel);s
EmprestimoModel.belongsTo(UserModel);
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DEST_DB
});
console.log(fs.existsSync(DEST_DB))
const Livro = createModel(sequelize);
sequelize.sync();



export { Livro as LivroModel, EmprestimoModel, UserModel,  sequelize };