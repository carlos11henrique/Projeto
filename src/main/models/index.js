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

Livro.hasMany(Emprestimo);
Emprestimo.belongsTo(Livro);

User.hasMany(Emprestimo);
Emprestimo.belongsTo(User);
(async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("Banco sincronizado com sucesso.");

        await Categoria.bulkCreate([
            { nome: 'Romance' },
            { nome: 'Ficção Científica' },
            { nome: 'Fantasia' },
            { nome: 'Terror' },
            { nome: 'Suspense' },
            { nome: 'Mistério' },
            { nome: 'Aventura' },
            { nome: 'Drama' },
            { nome: 'Comédia' },
            { nome: 'Policial' },
            { nome: 'Biografia' },
            { nome: 'Autobiografia' },
            { nome: 'História' },
            { nome: 'Filosofia' },
            { nome: 'Religião' },
            { nome: 'Espiritualidade' },
            { nome: 'Psicologia' },
            { nome: 'Autoajuda' },
            { nome: 'Educação' },
            { nome: 'Didático' },
            { nome: 'Acadêmico' },
            { nome: 'Ciência' },
            { nome: 'Matemática' },
            { nome: 'Física' },
            { nome: 'Química' },
            { nome: 'Biologia' },
            { nome: 'Tecnologia' },
            { nome: 'Programação' },
            { nome: 'Informática' },
            { nome: 'Direito' },
            { nome: 'Administração' },
            { nome: 'Economia' },
            { nome: 'Negócios' },
            { nome: 'Engenharia' },
            { nome: 'Medicina' },
            { nome: 'Enfermagem' },
            { nome: 'Arquitetura' },
            { nome: 'Artes' },
            { nome: 'Design' },
            { nome: 'Moda' },
            { nome: 'Esportes' },
            { nome: 'Culinária' },
            { nome: 'Viagem' },
            { nome: 'Poesia' },
            { nome: 'Quadrinhos' },
            { nome: 'Mangá' },
            { nome: 'Infantil' },
            { nome: 'Juvenil' },
            { nome: 'Erótico' }
        ]);
        console.log("Categorias inseridas com sucesso.");
    } catch (err) {
        console.error("Erro durante a inicialização:", err);
    }
})();

      

export { Livro as LivroModel, Emprestimo as EmprestimoModel, User as UserModel, sequelize, Categoria as CategoriaModel };
