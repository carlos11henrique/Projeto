<template>
  <div>
    <table class="w-full text-[16px] text-gray-700 dark:text-gray-300 table-auto">
      <thead class="text-base uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr class="text-center">
          <th class="px-6 py-4 w-56">
            <div class="flex items-center justify-center gap-2">
              <input 
                type="checkbox"
                @change="selecionarTodos"
                :checked="todosSelecionados"
                class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </th>
          <th class="px-6 py-4">Código</th>
          <th class="px-6 py-4">Exemplar</th>
          <th class="px-6 py-4 max-w-[200px] whitespace-normal break-words text-center">Título</th>
          <th class="px-6 py-4 max-w-[180px] whitespace-normal break-words text-center">Autor</th>
          <th class="px-6 py-4 max-w-[160px] whitespace-normal break-words text-center">Gênero</th>
          <th class="px-6 py-4">Ações</th>
        </tr>
      </thead>

      <tbody>
        <template v-for="(livro, index) in livrosPaginados" :key="livro.id">
          <tr 
            @click="toggleDetalhes(index)" 
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-center"
          >
            <td class="px-6 py-4 w-56">
              <input 
                type="checkbox" 
                :value="livro" 
                v-model="livrosSelecionados" 
                class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                @click.stop
              />
            </td>
            <td class="px-6 py-4">{{ livro.codigoLivro }}</td>
            <td class="px-6 py-4">{{ livro.exemplar }}</td>
            <td class="px-6 py-4 max-w-[200px] break-words">{{ livro.titulo }}</td>
            <td class="px-6 py-4 max-w-[180px] break-words">{{ livro.autor }}</td>
            <td class="px-6 py-4 max-w-[160px] break-words">{{ livro.Category?.dataValues?.nome || '-' }}</td>
            <td class="px-6 py-4 space-x-3">
              <button @click.stop="removerLivro(index)" class="text-red-600 hover:underline">Remover</button>
            </td>
          </tr>

          <!-- Detalhes do livro -->
          <tr v-if="livroAbertoIndex === index">
            <td colspan="7" class="bg-gray-100 dark:bg-gray-700 px-6 py-4 text-left">
              <div v-if="livro.imagem" class="mt-4 flex gap-4 items-center">
                <img :src="'atom:/' + livro.imagem" alt="Imagem do Livro" class="w-32 rounded shadow-lg object-contain" />
                <div>
                  <p><strong>Editora:</strong> {{ livro.editora }}</p>
                  <p><strong>Descrição:</strong> {{ livro.descricao }}</p>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

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
export default {
  name: "Lixeira",
  data() {
    return {
      livros: [],
      livrosSelecionados: [],
      livroAbertoIndex: null,
      currentPage: 1,
      itemsPerPage: 10,
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

    editarLivro(livro) {
      // lógica para editar
      console.log('Editar livro:', livro);
    },

    removerLivro(index) {
      // lógica para remover
      console.log('Remover livro índice:', index);
    }
  }
};
</script>
