const faker = require('faker-br');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const batchSize = 100; // Define o tamanho do batch
    const totalRecords = 1000; // Número total de registros
    const batches = Math.ceil(totalRecords / batchSize); // Número de lotes

    for (let batch = 0; batch < batches; batch++) {
      const categories = [];
      for (let i = 0; i < batchSize; i++) {
        if (batch * batchSize + i >= totalRecords) break; // Se ultrapassar o total de registros, interrompa
        categories.push({
          nome: faker.commerce.department(), // Nome da categoria gerado aleatoriamente
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      await queryInterface.bulkInsert('Categories', categories, {}); // Insere o batch no banco
    }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  },
};
