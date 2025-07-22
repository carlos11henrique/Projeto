<template>
  <div>
    <!-- Barra de ações -->
    <div class="flex flex-wrap items-center justify-between mb-6 gap-2">
      <div class="flex flex-wrap gap-2">
        <button @click="RestaurarSelecionados" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm shadow">
          Restaurar Selecionados
        </button>
        <button @click="removerSelecionados" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm shadow">
          Excluir Selecionados
        </button>
      </div>

      <div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Pesquisar livro..."
          class="p-2 border border-gray-300 rounded-md w-64 text-sm"
        />
      </div>
    </div>

    <!-- Lista de livros em cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="(livro, index) in livrosPaginados"
        :key="livro.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 relative cursor-pointer border hover:border-blue-400"
        @click="toggleDetalhes(index)"
      >
        <div class="absolute top-2 left-2">
          <input
            type="checkbox"
            :value="livro"
            v-model="livrosSelecionados"
            @click.stop
            class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        <h2 class="text-lg font-semibold text-center mb-2 break-words">{{ livro.titulo }}</h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 text-center mb-1"><strong>Código:</strong> {{ livro.codigoLivro }}</p>

        <div v-if="livroAbertoIndex === index" class="mt-4">
          <div v-if="livro.imagem" class="mb-2 flex justify-center">
            <img :src="'atom:/' + livro.imagem" alt="Imagem do Livro" class="w-24 h-32 object-contain rounded shadow" />
          </div>
          <p class="text-sm text-gray-700 dark:text-gray-200"><strong>Editora:</strong> {{ livro.editora }}</p>
          <p class="text-sm text-gray-700 dark:text-gray-200"><strong>Descrição:</strong> {{ livro.descricao }}</p>
          <p class="text-sm text-gray-700 dark:text-gray-200"><strong>Exemplar:</strong> {{ livro.exemplar }}</p>
          <p class="text-sm text-gray-700 dark:text-gray-200"><strong>Autor:</strong> {{ livro.autor }}</p>
          <p class="text-sm text-gray-700 dark:text-gray-200"><strong>Gênero:</strong> {{ livro.Category?.dataValues?.nome || '-'  }}</p>
        </div>

        <div class="mt-4 flex justify-center gap-3">
          <button @click.stop="restaurarLivro(index)" class="text-green-600 hover:underline">Restaurar</button>
          <button @click.stop="removerLivro(index)" class="text-red-600 hover:underline">Remover</button>
        </div>
      </div>
    </div>

    <!-- Paginação -->
    <div class="flex justify-center mt-6">
      <nav class="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-3 py-2 text-sm font-medium border border-gray-300 rounded-l-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>

        <button
          v-for="page in paginasVisiveis"
          :key="page"
          @click="setPage(page)"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
          :class="{ 'z-10 bg-blue-600 text-white': currentPage === page }"
        >
          {{ page }}
        </button>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="relative inline-flex items-center px-3 py-2 text-sm font-medium border border-gray-300 rounded-r-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        >
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
  name: "Lixeira",
  data() {
    return {
      livros: [],
      livrosSelecionados: [],
      categorys: [],
        searchQuery: "",
      livroAbertoIndex: null,
      currentPage: 1,
      itemsPerPage: 20,
    };
  },

  mounted() {
    this.carregarLivro();
  },

  computed: {
    totalPages() {
      return Math.ceil(this.livros.length / this.itemsPerPage);
    },
    livrosPaginados() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.livros.slice(start, end);
    },
    todosSelecionados() {
      return this.livrosSelecionados.length === this.livros.length && this.livros.length > 0;
    },
    paginasVisiveis() {
      const total = this.totalPages;
      let pages = [];
      for(let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }
  },

  methods: {
    async carregarLivro() {
      try {
        const livros = await window.api.getLivro();

        // Filtra só os livros inválidos
        const livrosInvalidos = livros.filter(l => l.status === 'invalido');

        this.livros = livrosInvalidos.map(l => ({
          ...l,
          selecionado: false,
          mostrarDetalhes: false
        }));
      } catch (e) {
        console.error(e);
        Swal.fire('Erro', 'Erro ao carregar livros.', 'error');
      }
    },
   async carregarCategoria() {
      try {
        this.categorys = await window.api.getCategoria();
      } catch (e) {
        console.error(e);
      }
    },
async carregarUsuario() {
  try {
    const usuarios = await window.api.getUsuario();
    this.usuarios = usuarios.filter(u => u.status === 'invalido');
  } catch (e) {
    console.error(e);
    Swal.fire('Erro', 'Erro ao carregar usuários.', 'error');
  }
},
    async restaurarLivro(index) {
  const livro = this.livros[index];

  const confirmacao = await Swal.fire({
    title: 'Deseja restaurar este livro?',
    text: `Título: ${livro.titulo}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sim, restaurar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirmacao.isConfirmed) return;

  try {
    const copiaLivro = JSON.parse(JSON.stringify(livro));
    copiaLivro.status = 'valido';
    await window.api.updateLivro(copiaLivro);

    Swal.fire('Restaurado!', 'Livro restaurado com sucesso.', 'success');
    this.carregarLivro();
  } catch (e) {
    console.error(e);
    Swal.fire('Erro', 'Erro ao restaurar o livro.', 'error');
  }
},



async RestaurarSelecionados() {
  try {
    if (!this.livrosSelecionados || this.livrosSelecionados.length === 0) {
      return Swal.fire('Atenção', 'Nenhum livro selecionado.', 'warning');
    }

    const confirmacao = await Swal.fire({
      title: 'Deseja restaurar os livros selecionados?',
      text: `Você está prestes a restaurar ${this.livrosSelecionados.length} livro(s).`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, restaurar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmacao.isConfirmed) return;

    for (const livro of this.livrosSelecionados) {
      const copiaLivro = JSON.parse(JSON.stringify({ ...livro, status: 'valido' }));
      await window.api.updateLivro(copiaLivro);
    }

    Swal.fire('Restaurado!', 'Livro(s) restaurado(s) com sucesso.', 'success');

    this.livrosSelecionados = [];
    await this.carregarLivro();

  } catch (error) {
    console.error('Erro ao restaurar livros:', error);
    Swal.fire('Erro!', 'Não foi possível restaurar os livros.', 'error');
  }
},
 
 async removerLivro(index) {
    const confirm = await Swal.fire({
      title: 'Remover livro da lixeira?',
      text: 'Essa ação é permanente e não poderá ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      backdrop: true,
    });

    if (confirm.isConfirmed) {
      try {
        // Remove da lista (caso esteja só no frontend)
        this.livrosInvalidos.splice(index, 1);

        await Swal.fire({
          title: 'Removido!',
          text: 'O livro foi removido da lixeira.',
          icon: 'success',
          timer: 1800,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error(error);
        Swal.fire('Erro!', 'Não foi possível remover o livro.', 'error');
      }
    } else {
      Swal.fire({
        title: 'Cancelado',
        text: 'Nenhum livro foi removido.',
        icon: 'info',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  },

    async removerSelecionados() {
      try {
        if (!this.livrosSelecionados || this.livrosSelecionados.length === 0) {
          return Swal.fire('Atenção', 'Nenhum livro selecionado.', 'warning');
        }

        const confirmacao = await Swal.fire({
          title: 'Deseja excluir os livros selecionados?',
          text: `Você está prestes a excluir ${this.livrosSelecionados.length} livro(s).`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sim, excluir',
          cancelButtonText: 'Cancelar'
        });

        if (!confirmacao.isConfirmed) return;

        for (const livro of this.livrosSelecionados) {
          await window.api.deleteLivro(livro.id);
        }

        Swal.fire('Excluído!', 'Livro(s) excluído(s) com sucesso.', 'success');

        this.livrosSelecionados = [];
        await this.carregarLivro();

      } catch (error) {
        console.error('Erro ao excluir livros:', error);
        Swal.fire('Erro!', 'Não foi possível excluir os livros.', 'error');
      }
    },
    


    toggleDetalhes(index) {
      this.livroAbertoIndex = this.livroAbertoIndex === index ? null : index;
    },

    selecionarTodos(event) {
      if (event.target.checked) {
        this.livrosSelecionados = [...this.livros];
      } else {
        this.livrosSelecionados = [];
      }
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },

    setPage(page) {
      this.currentPage = page;
    },


  }
};
</script>
