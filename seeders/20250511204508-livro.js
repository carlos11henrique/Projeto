const faker = require('faker-br');
const { create } = require('heatmap.js');


module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Buscar IDs das categorias já existentes
    const categorias = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (categorias.length === 0) {
      console.warn('⚠️ Nenhuma categoria encontrada. Skipping seed de livros.');
      return;
    }

    const livros = [];

    for (let i = 0; i < 200; i++) {
      const categoria = faker.helpers.randomize(categorias);
      console.log({
        titulo: faker.lorem.words(3),
        autor: faker.name.findName(),
        codigoLivro: faker.random.alphaNumeric(10),
        editora: faker.company.companyName(),
        descricao: faker.lorem.sentence(),
        exemplar: faker.random.number({ min: 1, max: 10 }),
        status:faker.helpers.randomize(['Disponível', 'Indisponível']),
        imagem : "aaaa",
        CategoryId: categoria.id,
      
      });
      livros.push({
        titulo: faker.lorem.words(3),
        autor: faker.name.findName(),
        codigoLivro: faker.random.alphaNumeric(10),
        editora: faker.company.companyName(),
        descricao: faker.lorem.sentence(),
        exemplar: faker.random.number({ min: 1, max: 10 }),
        status:faker.helpers.randomize(['Disponível', 'Indisponível']),
        imagem : "aaaa",
        CategoryId: categoria.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      
      });
    }

    await queryInterface.bulkInsert('Books', livros, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Books', null, {});
  },
};