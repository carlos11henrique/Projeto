<template>
  <div class="p-6 bg-white rounded shadow overflow-x-auto text-[15px]">
    <!-- Campo de busca -->
    <div class="mb-4">
      <label class="block text-base font-medium text-gray-800">Pesquisar Livro</label>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Código, título ou autor"
        class="mt-1 p-2 border border-gray-300 rounded-md w-full text-base"
      />
    </div>

    <!-- Tabela de livros -->
    <table class="min-w-full text-base text-left text-gray-800 border border-gray-300 rounded-md overflow-hidden">
      <thead class="bg-gray-100 font-semibold">
        <tr>
          <th class="px-4 py-3 border">Código</th>
          <th class="px-4 py-3 border">Título</th>
          <th class="px-4 py-3 border">Autor</th>
          <th class="px-4 py-3 border">Gênero</th>
          <th class="px-4 py-3 border">Exemplares</th>
          <th class="px-4 py-3 border">Imagem</th>
          <th class="px-4 py-3 border">Usuário</th>
          <th class="px-4 py-3 border">Devolução</th>
          <th class="px-4 py-3 border">Ações</th>
        </tr>
      </thead>
      <tbody>
<template v-for="(book, index) in paginatedBooks" :key="index">
<tr
  class="border-t border-gray-300 hover:bg-gray-50"
  :class="{ 'bg-red-100': isAtrasado(book.dataDevolucao) }"
>
          <td class="px-4 py-3">{{ book.codigoLivro }}</td>
            <td class="px-4 py-3 max-w-[200px] break-words">{{ book.titulo }}</td>
            <td class="px-4 py-3 max-w-[200px] break-words">{{ book.autor }}</td>
<td class="px-4 py-3 max-w-[200px] break-words">{{ book.Category.dataValues.nome || 'Sem Gênero' }}</td>

            <td class="px-4 py-3">{{ book.exemplar }}</td>
            <td class="px-4 py-3 text-center">
            <img
  v-if="book.imagem"
  :src="'atom:/' + book.imagem"
  alt="Imagem do Livro"
  class="h-40 w-auto mx-auto" 
/>
            </td>
            <td class="px-4 py-3">
              {{ book.emprestadoPara ? book.emprestadoPara.nome : '-' }}
            </td>
            <td
              class="px-4 py-3"
              :class="{ 'text-red-600 font-semibold': isAtrasado(book.dataDevolucao) }"
            >
              {{ book.dataDevolucao || '-' }}
            </td>
            <td class="px-4 py-3 space-x-2 whitespace-nowrap">
              <button
                v-if="!book.emprestadoPara"
                @click="iniciarEmprestimo(book)"
                class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Emprestar
              </button>
              <button
                v-else
                @click="devolverLivro(book)"
                class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Devolver
              </button>
              <button
                v-if="book.emprestadoPara"
                @click="aumentarPrazo(book)"
                class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Aumentar Prazo
              </button>
            </td>
          </tr>

          <!-- Linha de Empréstimo -->
          <tr
            v-if="bookSelecionado && bookSelecionado.codigoLivro === book.codigoLivro"
            class="bg-gray-50 border-b border-gray-300"
          >
            <td colspan="9" class="px-6 py-5">
              <div class="space-y-3">
                <h3 class="text-lg font-semibold">Emprestar Livro: {{ book.titulo }}</h3>

                <p><strong>Autor:</strong> {{ book.autor }}</p>
                <p><strong>Gênero:</strong> {{ book.Category.dataValues.nome }}</p>
                <p><strong>Exemplares:</strong> {{ book.exemplar }}</p>

                <!-- Campo de busca de usuários -->
                <div>
                  <label class="block text-sm font-medium text-gray-800">Selecionar Usuário</label>
                 <input
               v-model="searchUsuario"
               type="text"
                placeholder="Matrícula, nome ou CPF"
                class="mt-1 p-2 border border-gray-300 rounded-md w-full"
               @focus="mostrarLista = true"
                @blur="() => setTimeout(() => mostrarLista = false, 100)"
/>


                  <ul
                    v-if="filteredUsers.length"
                    class="mt-2 border border-gray-300 rounded bg-white max-h-32 overflow-y-auto"
                  >
                 <li
  v-for="user in filteredUsers"
  :key="user.matricula"
  @click="selecionarUsuario(user)"
  :class="[
    'p-2 hover:bg-gray-100 cursor-pointer',
    userSelecionado && userSelecionado.matricula === user.matricula ? 'bg-blue-100 font-semibold' : ''
  ]"
>
  {{ user.nome }} (M{{ user.matricula }}) (CPF {{ user.cpf }})
</li>

                  </ul>

                  <div class="mt-4 flex gap-3 flex-wrap">
                    <button
                      v-if="userSelecionado"
                      @click="finalizarEmprestimo"
                      class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Confirmar Empréstimo
                    </button>
                    <button
                      @click="cancelarEmprestimo"
                      class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="flex justify-center mt-6">
  <nav class="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
    <!-- Botão anterior -->
    <button
      @click="prevPage "
      :disabled="currentPage === 1"
      class="relative inline-flex items-center px-3 py-2 text-sm font-medium border border-gray-300 rounded-l-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Anterior
    </button>

    <!-- Botões de página -->
    <button
      v-for="page in paginasVisiveis"
      :key="page"
      @click="setPage(page)"
      class="relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
      :class="{ 'z-10 bg-blue-600 text-white': currentPage === page }">
      {{ page }}
    </button>

    <!-- Botão próxima -->
    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      class="relative inline-flex items-center px-3 py-2 text-sm font-medium border border-gray-300 rounded-r-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
      Próxima
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </nav>
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
      filteredUsers: [],
      mostrarLista: false,
      searchQuery: "",
      searchUsuario: "",
      bookSelecionado: null,
      userSelecionado: null,
      currentPage: 1,
itemsPerPage: 20,

    };
  },
  computed: {
  paginasVisiveis() {
    const total = this.totalPages;
    const atual = this.currentPage;
    const paginas = [];

    let inicio = Math.max(atual - 2, 1);
    let fim = Math.min(inicio + 4, total);

    if (fim - inicio < 4) {
      inicio = Math.max(fim - 4, 1);
    }

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    return paginas;
  },
filteredBooks() {
  const query = this.searchQuery.toLowerCase();

  const filtrados = this.books.filter(livro => {
    const codigo = livro.codigoLivro || '';
    const titulo = livro.titulo || '';
    const autor = livro.autor || '';
    const genero = livro.Category?.dataValues?.nome?.toLowerCase() || '';

    return (
      codigo.toString().includes(this.searchQuery) ||
      titulo.toLowerCase().includes(query) ||
      autor.toLowerCase().includes(query) ||
      genero.includes(query)
    );
  });

  // Ordena os resultados por título e exemplar
  const ordenados = filtrados.sort((a, b) => {
    const tituloA = a.titulo.toLowerCase();
    const tituloB = b.titulo.toLowerCase();

    if (tituloA < tituloB) return -1;
    if (tituloA > tituloB) return 1;

    return a.exemplar - b.exemplar;
  });

  // Emprestados no topo
  const emprestados = ordenados.filter(l => l.status === 'emprestado');
  const disponiveis = ordenados.filter(l => l.status !== 'emprestado');

  return [...emprestados, ...disponiveis];
},

paginatedBooks() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.filteredBooks.slice(start, end);
},
totalPages() {
  return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
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
     nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  },
   cancelarEmprestimo() {
    this.bookSelecionado = null;
    this.userSelecionado = null;
    this.searchUsuario = '';
  },
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  },


  setPage(page) {
    this.currentPage = page;
  },
     handleImagemSelecionada(event) {
    this.novoLivro.imagem = window.api.getPathInput(event.target);

  },
  
async carregarBooks() {
  try {
    const livros = await window.api.getLivro();

    // Corrige livros sem categoria
    this.books = livros.map(livro => {
      if (!livro.Category || !livro.Category.dataValues) {
        livro.Category = { dataValues: { nome: 'Sem Gênero' } };
      }
      return livro;
    });

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
    this.buscaUsuario = `${user.nome} (M${user.matricula})`; 
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
    devolucao.setDate(hoje.getDate() + 8);
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
        dataEmprestimo: hoje.toISOString().split('T')[0],
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
