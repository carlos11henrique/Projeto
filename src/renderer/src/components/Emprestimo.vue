<template>
  <div>
    <!-- Pesquisa de Livros -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Pesquisar Livro</label>
      <input v-model="searchQuery" type="text" placeholder="Código, título ou autor" class="mt-1 p-2 border border-gray-300 rounded-md w-full" />
    </div>

    <!-- Lista de Livros -->
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-6 py-3">Código</th>
          <th class="px-6 py-3">Título</th>
          <th class="px-6 py-3">Autor</th>
          <th class="px-6 py-3">Gênero</th>
          <th class="px-6 py-3">Exemplares</th>
          <th class="px-6 py-3">Usuário com Livro</th>
          <th class="px-6 py-3">Data de Devolução</th>
          <th class="px-6 py-3">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(book, index) in filteredBooks" :key="index" class="border-b">
          <td class="px-6 py-4">{{ book.codigoLivro }}</td>
          <td class="px-6 py-4">{{ book.titulo }}</td>
          <td class="px-6 py-4">{{ book.autor }}</td>
          <td class="px-6 py-4">{{ book.genero }}</td>
          <td class="px-6 py-4">{{ book.exemplar }}</td>
          <td class="px-6 py-4">{{ book.emprestadoPara ? book.emprestadoPara.nome : '-' }}</td>
          <td class="px-6 py-4" :class="{ 'text-red-600 font-semibold': isAtrasado(book.dataDevolucao) }">
            {{ book.dataDevolucao || '-' }}
          </td>
          <td class="px-6 py-4">
            <button v-if="!book.emprestadoPara" @click="iniciarEmprestimo(book)" class="bg-blue-500 text-white px-3 py-1 rounded">Emprestar</button>
            <button v-else @click="devolverLivro(book)" class="bg-red-500 text-white px-3 py-1 rounded">Devolver</button>
            <button v-if="book.emprestadoPara" @click="aumentarPrazo(book)" class="bg-yellow-500 text-white px-3 py-1 rounded ml-2">Aumentar Prazo</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Detalhes do Livro Selecionado -->
    <div v-if="bookSelecionado" class="mt-6 p-4 border rounded bg-gray-100">
      <h3 class="text-lg font-semibold">Livro Selecionado</h3>
      <p><strong>Título:</strong> {{ bookSelecionado.titulo }}</p>
      <p><strong>Autor:</strong> {{ bookSelecionado.autor }}</p>
      <p><strong>Gênero:</strong> {{ bookSelecionado.genero }}</p>
      <p><strong>Código:</strong> {{ bookSelecionado.codigoLivro }}</p>
      <p><strong>Exemplares:</strong> {{ bookSelecionado.exemplar }}</p>
      <p><strong>Data de Devolução:</strong> {{ bookSelecionado.dataDevolucao || 'Não Emprestado' }}</p>
      <p><strong>Usuário:</strong> {{ bookSelecionado.emprestadoPara ? bookSelecionado.emprestadoPara.nome : 'Ninguém' }}</p>
      <p><strong>Situação do Livro:</strong> {{ bookSelecionado.status || (bookSelecionado.emprestadoPara ? 'Emprestado' : 'Disponível') }}</p>

      <!-- Seleção de Usuário para Empréstimo -->
      <div class="mt-4">
        <h3 class="text-lg font-semibold">Selecionar Usuário</h3>
        <input v-model="searchUsuario" type="text" placeholder="Matrícula, nome ou CPF" class="mt-1 p-2 border rounded-md w-full" />
        <ul v-if="filteredUsers.length" class="mt-2 border rounded bg-white max-h-32 overflow-y-auto">
          <li v-for="user in filteredUsers" :key="user.matricula" @click="selecionarUsuario(user)" class="p-2 hover:bg-gray-200 cursor-pointer">
            {{ user.nome }} ({{ user.matricula }})
          </li>
        </ul>
        <button v-if="userSelecionado" @click="finalizarEmprestimo" class="mt-4 bg-green-500 text-white px-4 py-2 rounded">Confirmar Empréstimo</button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      books: [],
      users: [],
      loans: [],
      searchQuery: "",
      searchUsuario: "",
      bookSelecionado: null,
      userSelecionado: null,
    };
  },
  computed: {
    filteredBooks() {
      const query = this.searchQuery.toLowerCase();
      const livrosFiltrados = this.books.filter(livro => {
        const codigo = livro.codigoLivro || '';
        const titulo = livro.titulo || '';
        const autor = livro.autor || '';
        return (
          codigo.toString().includes(this.searchQuery) ||
          titulo.toLowerCase().includes(query) ||
          autor.toLowerCase().includes(query)
        );
      });

      const emprestados = livrosFiltrados.filter(livro => livro.status === 'emprestado');
      const disponiveis = livrosFiltrados.filter(livro => livro.status !== 'emprestado');
      return [...emprestados, ...disponiveis];
    },
    filteredUsers() {
      return this.users.filter(user =>
        user.nome.toLowerCase().includes(this.searchUsuario.toLowerCase()) ||
        user.matricula.toLowerCase().includes(this.searchUsuario.toLowerCase()) ||
        user.cpf.includes(this.searchUsuario)
      );
    }
  },
  methods: {
    async carregarBooks() {
      try {
        const livros = await window.api.getLivro();
        this.books = livros.map(livro => ({ ...livro, status: 'disponivel' }));
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
      }
    },

    async carregarUsers() {
      try {
        const usuarios = await window.api.getUser();
        this.users = usuarios;
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    },

    async carregarLoans() {
  try {
    const loans = await window.api.getEmprestimo();

    // Garante que seja um array antes de continuar
    if (!Array.isArray(loans)) {
      console.error("Dados de empréstimos inválidos:", loans);
      return;
    }

    this.books.forEach(book => {
      book.emprestadoPara = null;
      book.dataDevolucao = null;
      book.status = 'disponivel';
      book.loanId = null;
    });

    loans.forEach(loan => {
      if (loan.status === 'emprestado') {
        const book = this.books.find(b => b.id === loan.BookId || b.id === loan.LivroId);
        const user = this.users.find(u => u.id === loan.UserId);
        if (book) {
          book.emprestadoPara = user || { nome: 'Desconhecido' };
          book.dataDevolucao = new Date(loan.dataDevolucao).toLocaleDateString('pt-BR');
          book.status = 'emprestado';
          book.loanId = loan.id;
        }
      }
    });
  } catch (error) {
    console.error('Erro ao carregar empréstimos:', error);
  }
}
,

    iniciarEmprestimo(book) {
      this.bookSelecionado = book;
      this.searchUsuario = '';
      this.userSelecionado = null;
      this.carregarUsers();
    },

    selecionarUsuario(user) {
      this.userSelecionado = user;
      this.searchUsuario = '';
    },

    async finalizarEmprestimo() {
  try {
    if (!this.bookSelecionado || !this.userSelecionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Por favor, selecione um livro e um usuário.',
      });
      return;
    }

    const hoje = new Date();
    const devolucao = new Date();
    devolucao.setDate(hoje.getDate() + 14);
    const dataFormatada = devolucao.toLocaleDateString('pt-BR');

    const confirmacao = await Swal.fire({
      title: 'Confirmar Empréstimo?',
      html: `
        <strong>Livro:</strong> "${this.bookSelecionado.titulo}"<br/>
        <strong>Usuário:</strong> ${this.userSelecionado.nome}<br/>
        <strong>Devolução:</strong> ${dataFormatada}
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, emprestar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacao.isConfirmed) {
      await window.api.createEmprestimo({
        BookId: this.bookSelecionado.id,
        UserId: this.userSelecionado.id,
        dataDevolucao: devolucao.toISOString().split('T')[0],
        status: 'emprestado'
      });

      Swal.fire({
        title: '📚 Empréstimo Realizado!',
        html: `Livro: "${this.bookSelecionado.titulo}"<br/>Usuário: ${this.userSelecionado.nome}<br/>Devolução até: ${dataFormatada}`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });

      this.bookSelecionado = null;
      this.userSelecionado = null;

      await this.carregarLoans();
    }
  } catch (error) {
    console.error('Erro ao criar empréstimo:', error);
    Swal.fire('Erro', 'Não foi possível realizar o empréstimo.', 'error');
  }
},


async devolverLivro(book) {
  const confirm = await Swal.fire({
    title: 'Tem certeza?',
    html: `Deseja marcar o livro <strong>"${book.titulo}"</strong> como devolvido?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sim, devolver',
    cancelButtonText: 'Não',
  });

  if (confirm.isConfirmed) {
    try {
      await window.api.updateEmprestimo({
        id: book.loanId,
        LivroId: book.id,
        dataDevolucao: new Date().toISOString().split('T')[0],
        devolvido: true,
        status: 'disponivel'
      });

      Swal.fire({
        title: '✅ Livro Devolvido!',
        html: `<strong>Título:</strong> "${book.titulo}"<br/><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}`,
        icon: 'info',
        confirmButtonText: 'Ok',
      });

      await this.carregarLoans();
    } catch (error) {
      console.error('Erro ao devolver livro:', error);
    }
  }
},


async aumentarPrazo(book) {
  if (!book.dataDevolucao || !book.loanId) return;

  const confirm = await Swal.fire({
    title: 'Aumentar prazo?',
    html: `Deseja estender o prazo do livro <strong>"${book.titulo}"</strong> por mais 7 dias?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, estender',
    cancelButtonText: 'Não',
  });

  if (!confirm.isConfirmed) return;

  try {
    const partes = book.dataDevolucao.split('/');
    const dataISO = `${partes[2]}-${partes[1]}-${partes[0]}`;
    const novaData = new Date(dataISO);
    novaData.setDate(novaData.getDate() + 7);

    await window.api.updateEmprestimo({
      id: book.loanId,
      LivroId: book.id,
      dataDevolucao: novaData.toISOString().split('T')[0],
      status: 'emprestado'
    });

    Swal.fire({
      title: '📅 Prazo Estendido!',
      html: `Livro: "${book.titulo}"<br/>Nova data de devolução: ${novaData.toLocaleDateString('pt-BR')}`,
      icon: 'success',
      confirmButtonText: 'Entendido',
    });

    await this.carregarLoans();
  } catch (error) {
    console.error('Erro ao atualizar empréstimo:', error);
  }
},

    isAtrasado(dataDevolucao) {
      if (!dataDevolucao) return false;
      const partes = dataDevolucao.split('/');
      const data = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      data.setHours(0, 0, 0, 0);
      return data < hoje;
    }
  },

  async mounted() {
    await this.carregarBooks();
    await this.carregarUsers();
    await this.carregarLoans();
  }
};
</script>
