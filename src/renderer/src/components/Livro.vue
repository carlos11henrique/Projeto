<template>
  <div>
    <form @submit.prevent="adicionarLivro" class="mb-6">
      <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label for="titulo" class="block mb-2 text-sm font-medium text-gray-900">Título do Livro</label>
          <input v-model="novoLivro.titulo" type="text" id="titulo"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required />
        </div>
        <div>
          <label for="autor" class="block mb-2 text-sm font-medium text-gray-900">Autor</label>
          <input v-model="novoLivro.autor" type="text" id="autor"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required />
        </div>
        <div>
          <label for="editora" class="block mb-2 text-sm font-medium text-gray-900">Editora</label>
          <input v-model="novoLivro.editora" type="text" id="editora"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required />
        </div>

    <div>
  <label for="genero" class="block mb-2 text-sm font-medium text-gray-900">Gênero</label>
<input
  :value="getNomeCategoria(novoLivro.categoryId)"
  @input="atualizarCategoriaPorNome($event.target.value)"
  list="listaCategorias"
  id="genero"
  name="genero"
  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  placeholder="Digite ou selecione um gênero"
/>

<datalist id="listaCategorias">
  <option
    v-for="cat in categorys"
    :key="cat.id"
    :value="cat.nome"
  ></option>
</datalist>

</div>


        <div>
          <label for="codigoLivro" class="block mb-2 text-sm font-medium text-gray-900">Código do Livro</label>
          <input v-model="novoLivro.codigoLivro" type="text" id="codigoLivro"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required />
        </div>

        <div>
          <label for="descricao" class="block mb-2 text-sm font-medium text-gray-900">Descrição</label>
          <input v-model="novoLivro.descricao" type="text" id="descricao"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required />
        </div>

        <div>
          <label for="exemplar" class="block mb-2 text-sm font-medium text-gray-900">Exemplar</label>
          <input v-model="novoLivro.exemplar" type="text" id="exemplar"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required />
        </div>

        <div>
          <label v-if="!editando" for="quantidade" class="block mb-2 text-sm font-medium text-gray-900">Quantidade</label>
          <input v-if="!editando" v-model="novoLivro.quantidade" type="number" id="quantidade"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required />
        </div>

        <div class="md:col-span-2">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload Imagem</label>
          <input
            ref="fileInput"
            @change="handleImagemSelecionada"
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            id="file_input"
            type="file"
          />
        </div>
      </div>
  <div class="flex flex-wrap gap-4 mt-4">
  <button
    v-if="!editando"
    type="submit"
    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
  >
    Cadastrar
  </button>

  <div v-else class="flex flex-wrap gap-4">
    <button
      @click="salvarEdicaoLivro"
      type="button"
      class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
    >
      Salvar Edição
    </button>

    <button
      @click="cancelarEdicao"
      type="button"
      class="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
    >
      Cancelar
    </button>
  </div>
</div>

    </form>

    <input v-model="searchQuery" type="text" placeholder="Pesquisar livro..." class="mt-4 mb-4 p-2 border border-gray-300 rounded-md w-full" />
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th class="px-6 py-4">Código</th>
          <th class="px-6 py-4">Exemplar</th>
          <th class="px-6 py-4">Título</th>
          <th class="px-6 py-4">Autor</th>
          <th class="px-6 py-4">Editora</th>
          <th class="px-6 py-4">Gênero</th>
          <th class="px-6 py-4">Imagem</th>
          <th class="px-6 py-4">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(livro, index) in filteredLivro" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <td class="px-6 py-4 text-lg">{{ livro.codigoLivro }}</td> 
          <td class="px-6 py-4 text-lg">{{ livro.exemplar }}</td>
          <td class="px-6 py-4 text-lg">{{ livro.titulo }}</td>
          <td class="px-6 py-4 text-lg">{{ livro.autor }}</td>
          <td class="px-6 py-4 text-lg">{{ livro.editora }}</td>
          <td class="px-6 py-4 text-lg">{{ livro.Category.dataValues.nome || '-' }}</td>
          <td class="px-6 py-4">
  <img v-if="livro.imagem" :src="'atom:/' + livro.imagem" alt="Imagem do Livro" class="h-30 w-auto" />
</td>
          <td class="px-6 py-4">
            <button @click="editarLivro(index)" class="text-blue-600 hover:underline text-lg">Editar</button>
            <button @click="removerLivro(index)" class="text-red-600 hover:underline ml-3 text-lg">Remover</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Paginação Estilizada com Tailwind -->
<div class="flex justify-center mt-6">
  <nav class="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
    <!-- Botão anterior -->
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      class="relative inline-flex items-center px-3 py-2 text-sm font-medium border border-gray-300 rounded-l-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Anterior
    </button>

    <!-- Botões de página -->
    <button
      v-for="page in totalPages"
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
  name: "Livro",
  data() {
    return {
      novoLivro: {
        codigoLivro: "",
        titulo: "",
        autor: "",
        editora: "",
        categoryId: 0,
        descricao: "",
        exemplar: "",
        quantidade: 0,
        imagem: "",
        imagemOriginal: ""
      },
      livros: [],
      searchQuery: "",
      categorys: [], 
      editando: false,
      indexEdicao: null,
      
      // Correção: currentPage e itemsPerPage fora do novoLivro
      currentPage: 1,
      itemsPerPage: 20,
    };
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;  // Reseta para página 1 sempre que o filtro mudar
    }
  },
  computed: {
    filteredLivro() {
      // Filtro de livros pela searchQuery (título ou autor)
      const query = this.searchQuery.toLowerCase();
      const livrosFiltrados = this.livros.filter(livro =>
        livro.titulo.toLowerCase().includes(query) ||
        livro.autor.toLowerCase().includes(query)
      );

      // Paginação: fatiar array de livros filtrados
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return livrosFiltrados.slice(start, end);
    },
    totalPages() {
      const query = this.searchQuery.toLowerCase();
      const totalFiltrados = this.livros.filter(livro =>
        livro.titulo.toLowerCase().includes(query) ||
        livro.autor.toLowerCase().includes(query)
      );
      return Math.ceil(totalFiltrados.length / this.itemsPerPage) || 1;
    },
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    setPage(page) {
      this.currentPage = page;
    },
    handleImagemSelecionada(event) {
      this.novoLivro.imagem = window.api.getPathInput(event.target);
    },
    getNomeCategoria(id) {
      const cat = this.categorys.find(c => c.id === id);
      return cat ? cat.nome : '';
    },
    atualizarCategoriaPorNome(nome) {
      const categoria = this.categorys.find(cat => cat.nome === nome);
      this.novoLivro.categoryId = categoria ? categoria.id : 0;
    },
    async adicionarLivro() {
      if (this.editando) return; 

      const livroBase = this.novoLivro;
      const quantidade = parseInt(livroBase.quantidade);
      const codigoBase = livroBase.codigoLivro.replace(/\d+$/, '') || livroBase.codigoLivro;
      const numeroInicial = parseInt(livroBase.codigoLivro.match(/\d+$/)) || 1;

      if (
        livroBase.codigoLivro && livroBase.titulo && livroBase.autor &&
        livroBase.editora && livroBase.categoryId &&
        quantidade > 0
      ) {
        try {
          for (let i = 0; i < quantidade; i++) {
            const novoCodigo = `${codigoBase}${numeroInicial + i}`;
            const novoExemplar = `${numeroInicial + i}`;

            const novoLivro = {
              ...livroBase,
              codigoLivro: novoCodigo,
              exemplar: novoExemplar,
              quantidade: 1,
              imagem: livroBase.imagem,
              CategoryId: livroBase.categoryId
            };

            await window.api.createLivro(novoLivro);
          }

          Swal.fire({
            icon: 'success',
            title: 'Livros cadastrados!',
            text: 'Todos os exemplares foram adicionados com sucesso.'
          });

          this.resetarFormulario();
          this.carregarLivro();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Não foi possível cadastrar os livros.'
          });
          console.error(error);
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Campos obrigatórios!',
          text: 'Preencha todos os campos corretamente.'
        });
      }
    },
    editarLivro(index) {
      this.novoLivro = { ...this.livros[index] };
      this.editando = true;
      this.indexEdicao = index;
    },
    async salvarEdicaoLivro() {
      try {
        const livroParaSalvar = JSON.parse(JSON.stringify(this.novoLivro)); 
        await window.api.updateLivro(livroParaSalvar);

        Swal.fire({
          icon: 'success',
          title: 'Livro atualizado!',
          text: 'As informações foram alteradas com sucesso.'
        });

        this.resetarFormulario();
        this.carregarLivro();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível atualizar o livro.'
        });
        console.error('Erro ao atualizar livro:', error);
      }
    },
    async removerLivro(index) {
      const livro = this.livros[index];

      Swal.fire({
        title: 'Tem certeza?',
        text: "Deseja remover este livro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await window.api.deleteLivro(livro.id);
            this.livros.splice(index, 1);
            Swal.fire('Removido!', 'O livro foi removido.', 'success');
          } catch (error) {
            Swal.fire('Erro', 'Não foi possível remover o livro.', 'error');
          }
        }
      });
    },
    async carregarCategoria() {
      try {
        const categorys = await window.api.getCategoria();
        this.categorys = categorys; 
      } catch (error) {
        console.error('Erro ao carregar categorys:', error);
      }
    },
    async carregarLivro() {
      try {
        const livros = await window.api.getLivro();
        this.livros = livros;
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
        Swal.fire('Erro', 'Não foi possível carregar os livros.', 'error');
      }
    },
    resetarFormulario() {
      this.novoLivro = {
        codigoLivro: "",
        titulo: "",
        autor: "",
        editora: "",
        categoryId: 0,
        descricao: "",
        exemplar: "",
        quantidade: 0,
        imagem: "",
        imagemOriginal: ""
      };
      this.editando = false;
      this.indexEdicao = null;
      this.currentPage = 1; // reseta paginação ao limpar form
    }
  },
  mounted() {
    this.carregarLivro();
    this.carregarCategoria(); 
  }
};

</script>



