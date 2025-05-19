const faker = require('faker-br');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Buscar todos os livros e usuários disponíveis
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const books = await queryInterface.sequelize.query(
      'SELECT id FROM Books;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Se não houver usuários ou livros, não cria empréstimos
    if (users.length === 0 || books.length === 0) {
      console.warn('⚠️ Nenhum usuário ou livro encontrado. Skipping seed de empréstimos.');
      return;
    }

    const emprestimos = [];

    for (let i = 0; i < 600; i++) {
      const user =faker.helpers.randomize(users);
      const book = faker.helpers.randomize(books);

      const dataEmprestimo = new Date();
      const dataDevolucao = new Date();

      emprestimos.push({
        dataEmprestimo,
        dataDevolucao,
        status: faker.helpers.randomize(['emprestado', 'devolvido']),
        UserId: user.id,
        BookId: book.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Loans', emprestimos, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Loans', null, {});
  },
};