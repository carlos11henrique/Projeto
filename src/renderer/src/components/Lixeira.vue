<template>
    <div class="flex flex-wrap items-center justify-between mb-4 gap-2">
  <div class="flex flex-wrap gap-2">

     <button 
      @click="RestaurarSelecionados" 
      class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm shadow"
    >
      Restaurar Selecionados
    </button>
    <button 
      @click="removerSelecionados" 
      class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm shadow"
    >
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
            <button @click.stop="restaurarLivro(index)" class="text-green-600 hover:underline">Restaurar</button>

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
import Swal from 'sweetalert2';

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
