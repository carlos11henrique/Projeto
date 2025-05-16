const faker = require('faker-br');
module.exports = {
up: async (queryInterface, Sequelize) => {
  const batchSize = 100;
  const totalRecords = 1000;
  const batches = Math.ceil(totalRecords / batchSize);

  for (let batch = 0; batch < batches; batch++) {
    const users = [];
    for (let i = 0; i < batchSize; i++) {
      if (batch * batchSize + i >= totalRecords) break;

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

    try {
      await queryInterface.bulkInsert('Users', users, {});
    } catch (err) {
      console.error('Erro ao inserir usuários no batch', batch, ':', err.errors || err);
      throw err; // Para parar o processo após o erro
    }
  }
},

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
