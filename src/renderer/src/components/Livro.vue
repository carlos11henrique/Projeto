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
      <select
  v-model="novoLivro.categoriaId"
  id="categoriaId"
  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  >
  <option disabled value="">Selecione um gênero</option>
  <option 
    v-for="categoria in categorias" 
    :key="categoria.id" 
    :value="categoria.id"
  >
    {{ categoria.nome }}
  </option>
</select>

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
<input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file">
    </div>
  </div>
  <button type="submit"
    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
    Cadastrar
  </button>
  <button v-if="editando" @click="salvarEdicaoLivro"
  class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-2">
  Salvar Edição
</button>

</form>


    <input v-model="searchQuery" type="text" placeholder="Pesquisar livro..." class="mt-4 mb-4 p-2 border border-gray-300 rounded-md w-full" />
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
  <tr>
    <th class="px-6 py-3">Código</th>
    <th class="px-6 py-3">Exemplar</th>
    <th class="px-6 py-3">Título</th>
    <th class="px-6 py-3">Autor</th>
    <th class="px-6 py-3">Editora</th>
    <th class="px-6 py-3">Gênero</th>
    <th class="px-6 py-3">Imagem</th>
    <th class="px-6 py-3">Ações</th>
  </tr>
</thead>
<tbody>
  <tr v-for="(livro, index) in filteredLivro" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    <td class="px-6 py-4">{{ livro.codigoLivro }}</td> 
    <td class="px-6 py-4">{{ livro.exemplar }}</td>
    <td class="px-6 py-4">{{ livro.titulo }}</td>
    <td class="px-6 py-4">{{ livro.autor }}</td>
    <td class="px-6 py-4">{{ livro.editora }}</td>
    <td class="px-6 py-4">{{ livro.categor }}</td>
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
  categoriaId: "", 
  descricao: "",
  exemplar: "",
  quantidade: 0,
  imagem: "",
  categoriaId: '',
},

    livros: [],
    searchQuery: "",
    categorias: [],  // Correção aqui
    editando: false,
    indexEdicao: null
  };


  },
  computed: {
    filteredLivro() {
      return this.livros.filter(livro =>
        livro.titulo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        livro.autor.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        livro.genero.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {

   async getNomeCategoria(id) {
  const cat = this.categorias.find(c => c.id === id);
  return cat ? cat.nome : 'Desconhecido';
},

    async adicionarLivro() {
      if (this.editando) return; // bloqueia adicionar enquanto edita

      const livroBase = this.novoLivro;
      const quantidade = parseInt(livroBase.quantidade);
      const codigoBase = livroBase.codigoLivro.replace(/\d+$/, '') || livroBase.codigoLivro;
      const numeroInicial = parseInt(livroBase.codigoLivro.match(/\d+$/)) || 1;

      if (
        livroBase.codigoLivro && livroBase.titulo && livroBase.autor &&
        livroBase.editora && livroBase.categoriaId && quantidade > 0
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
              categoriaId: livroBase.categoriaId

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
            await window.api.deleteLivro(livro.codigoLivro);
            this.carregarLivro();

            Swal.fire('Removido!', 'O livro foi removido.', 'success');
          } catch (error) {
            Swal.fire('Erro', 'Não foi possível remover o livro.', 'error');
          }
        }
      });
    },

    async carregarCategoria() {
  try {
    const categorias = await window.api.getCategoria();
    this.categorias = categorias;  // Armazenando as categorias na variável correta
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
},

    async carregarLivro() {
      try {
        const livros = await window.api.getLivro();
        this.livros = livros;
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
      }
    },

    resetarFormulario() {
      this.novoLivro = {
        codigoLivro: "",
        titulo: "",
        autor: "",
        editora: "",
        categoriaId: "",
        descricao: "",
        exemplar: "",
        quantidade: 0,
        imagem: ""
      };
      this.editando = false;
      this.indexEdicao = null;
    }
  },
  mounted() {
    this.carregarLivro();
    this.carregarCategoria(); 

  }
};
</script>



