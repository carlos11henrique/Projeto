<template>
    <div>
      <form @submit.prevent="adicionarLivro" class="mb-6">
        <div class="grid gap-6 mb-6 md:grid-cols-2">
         
          <div>
            <label for="titulo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Título do Livro</label>
            <input v-model="novoLivro.titulo" type="text" id="titulo" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <div>
            <label for="autor" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Autor</label>
            <input v-model="novoLivro.autor" type="text" id="autor" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <div>
            <label for="editora" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Editora</label>
            <input v-model="novoLivro.editora" type="text" id="editora" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <div>
            <label for="genero" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gênero</label>
            <input v-model="novoLivro.genero" type="text" id="genero" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <div>
            <label for="codigo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Código do Livro</label>
            <input v-model="novoLivro.codigoLivro" type="text" id="codigoLivro" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <div>
            <div>
            <label for="codigo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
            <input v-model="novoLivro.descricao" type="text" id="descricao" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <div>
            <label for="Exemplar" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Exemplar</label>
            <input v-model="novoLivro.exempla" type="text" id="exemplar" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>

            <label for="quantidade" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantidade</label>
            <input v-model="novoLivro.quantidade" type="number" id="quantidade" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <div>
            <label for="imagem" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Imagem do Livro (URL)</label>
            <input v-model="novoLivro.imagem" type="text" id="imagem" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          </div>
        </div>
        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cadastrar</button>
      </form>
  
      <input v-model="searchQuery" type="text" placeholder="Pesquisar livro..." class="mt-4 mb-4 p-2 border border-gray-300 rounded-md w-full" />
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      <th class="px-6 py-3">Código</th>
      <th class="px-6 py-3">Título</th>
      <th class="px-6 py-3">Autor</th>
      <th class="px-6 py-3">Editora</th>
      <th class="px-6 py-3">Gênero</th>
      <th class="px-6 py-3">Quantidade</th>
      <th class="px-6 py-3">Imagem</th>
      <th class="px-6 py-3">Ações</th>
    </tr>
  </thead>
  <tbody>
  <tr v-for="(livro, index) in livros" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    <td class="px-6 py-4">{{ livro.codigoLivro }}</td> <!-- CORRIGIDO -->
    <td class="px-6 py-4">{{ livro.titulo }}</td>
    <td class="px-6 py-4">{{ livro.autor }}</td>
    <td class="px-6 py-4">{{ livro.editora }}</td>
    <td class="px-6 py-4">{{ livro.genero }}</td>
    <td class="px-6 py-4">{{ livro.quantidade }}</td>
    <td class="px-6 py-4">
      <img :src="livro.imagem" alt="Imagem do Livro" class="h-16 w-auto" />
    </td>
    <td class="px-6 py-4">
      <button @click="editarLivro(index)" class="text-blue-600 hover:underline">Editar</button>
      <button @click="removerLivro(index)" class="text-red-600 hover:underline ml-3">Remover</button>
    </td>
  </tr>
</tbody>

</table>
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
        genero: "",
        descricao: "",
        quantidade: 0,
        imagem: ""
      },
      livros: [],

      searchQuery: ""
    };
  },
  computed: {
    filteredLivro() {
    return this.livro.filter(livro => 
      livro.titulo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      livro.autor.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      livro.genero.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  },

  },
  methods: {
    async adicionarLivro() {
      const livro = this.novoLivro;

      if (
        livro.codigoLivro && livro.titulo && livro.autor &&
        livro.editora && livro.genero && livro.quantidade >= 0
      ) {
        try {
          await window.api.createLivro({ ...livro });

          Swal.fire({
            icon: 'success',
            title: 'Livro cadastrado!',
            text: 'O livro foi adicionado com sucesso.'
          });

          this.novoLivro = {
            codigoLivro: "",
            titulo: "",
            autor: "",
            editora: "",
            genero: "",
            descricao: "",
            quantidade: 0,
            imagem: ""
          };

          this.carregarLivro();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Não foi possível cadastrar o livro.'
          });
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Campos obrigatórios!',
          text: 'Preencha todos os campos corretamente.'
        });
      }
    },
    async carregarLivro() {
    try {
      const livros = await window.api.getLivro();
      console.log(livros);
      this.livros = livros;
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    }
  },
    editarLivro(index) {
      this.novoLivro = { ...this.livros[index] };
      this.livros.splice(index, 1); // remove temporariamente da lista, será recriado ao salvar
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
            await window.api.deleteLivro(livro.codigoLivro);
            this.carregarLivro();

            Swal.fire('Removido!', 'O livro foi removido.', 'success');
          } catch (error) {
            Swal.fire('Erro', 'Não foi possível remover o livro.', 'error');
          }
        }
      });
    },
 
  },
  mounted() {
    this.carregarLivro();
    
  }
};

</script>




