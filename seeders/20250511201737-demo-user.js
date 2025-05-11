const faker = require('faker-br');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const batchSize = 100; // Define o tamanho do batch
    const totalRecords = 1000; // Número total de registros
    const batches = Math.ceil(totalRecords / batchSize); // Número de lotes

    for (let batch = 0; batch < batches; batch++) {
      const users = [];
      for (let i = 0; i < batchSize; i++) {
        if (batch * batchSize + i >= totalRecords) break; // Se ultrapassar o total de registros, interrompa
        users.push({
          nome: faker.name.findName(),
          telefone: faker.phone.phoneNumber(),
          cpf: faker.br.cpf(),
          matricula: faker.random.alphaNumeric(6),
          tipo: faker.random.arrayElement(['Aluno', 'Professor', 'Terceiros']),
          turma: faker.random.word(),
          serie: faker.random.word(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      await queryInterface.bulkInsert('Users', users, {}); // Insere o batch no banco
    }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
