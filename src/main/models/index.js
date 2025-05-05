import { Sequelize } from "sequelize";
import { DEST_USER, DEST_DB } from "../util/caminho";
import { createModel } from "./modelsLivro";
import { EmprestimoModel } from "./modelsEmprestimo";
import { UserModel } from "./modelsUser";
import { CategoriaModel } from "./modelsCategoria";
import fs from "node:fs";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DEST_DB
});

console.log("DB existe:", fs.existsSync(DEST_DB));

const Categoria = CategoriaModel(sequelize);
const Livro = createModel(sequelize);
const User = UserModel(sequelize);
const Emprestimo = EmprestimoModel(sequelize);


 
Categoria.hasMany(Livro);
Livro.belongsTo(Categoria);
Livro.hasMany(Emprestimo);
Emprestimo.belongsTo(Livro);
User.hasMany(Emprestimo);
Emprestimo.belongsTo(User);
(async () => {
    try {
        
        await sequelize.sync({ force: true });
        console.log("Banco sincronizado com sucesso.");
        

        
    } catch (err) {
        console.error("Erro durante a inicialização:", err);
    }
})();

      

export { Livro as LivroModel, Emprestimo as EmprestimoModel, User as UserModel, sequelize, Categoria as CategoriaModel };
