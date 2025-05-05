const { Categoria } = require('./modelsCategoria'); // ou o caminho correto para seu model
const { sequelize } = require('./modelsCategoria'); // para conectar o banco

async function seedCategorias() {
  const categorias = [
    'Romance', 'Ficção Científica', 'Fantasia', 'Mistério', 'Terror', 'Suspense', 'Drama',
    // ... (todas as outras)
    'Genética', 'Nanotecnologia', 'Robótica', 'Astronomia', 'Geografia', 'História da Arte'
  ];

  await sequelize.sync(); // garante que os modelos estejam sincronizados

  await Categoria.bulkCreate(
    categorias.map(nome => ({
      nome,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  );

  console.log('Categorias inseridas com sucesso!');
}

seedCategorias()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Erro ao inserir categorias:', err);
    process.exit(1);
  });
