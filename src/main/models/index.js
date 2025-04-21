import { Sequelize } from "sequelize";
import { DEST_USER, DEST_DB } from "../util/caminho";
import { createModel } from "./modelsLivro";
import { EmprestimoModel } from "./modelsEmprestimo";
import { UserModel } from "./modelsUser";
import fs from "node:fs";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DEST_DB
});

console.log(fs.existsSync(DEST_DB));

const Livro = createModel(sequelize);
const User = createModel(sequelize);
const Emprestimo = createModel(sequelize);

Livro.hasMany(Emprestimo);
Emprestimo.belongsTo(Livro);

User.hasMany(Emprestimo);
Emprestimo.belongsTo(User);

sequelize.sync();

export { Livro as LivroModel, Emprestimo as EmprestimoModel, User as UserModel, sequelize };
