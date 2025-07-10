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
      @click="resetarFormulario"
      type="button"
      class="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
    >
      Cancelar
    </button>
  </div>
</div>

    </form>

 <input v-model="searchQuery" type="text" placeholder="Pesquisar livro..." class="mt-4 mb-4 p-2 border border-gray-300 rounded-md w-full" />
 <table class="w-full text-[16px] text-gray-700 dark:text-gray-300">
  <thead class="text-base uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      <th class="px-6 py-4 w-56">
        <div class="flex items-center justify-center gap-2">
          <input 
            type="checkbox" 
            v-model="selectAll" 
            @change="toggleSelectAll" 
            class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
       <button 
  @click="gerarEtiquetasSelecionadas()" 
  class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md shadow text-sm">
  Etiquetas
</button>

        </div>
      </th>
      <th class="px-6 py-4">Código</th>
      <th class="px-6 py-4">Exemplar</th>
      <th class="px-6 py-4">Título</th>
      <th class="px-6 py-4">Autor</th>
      <th class="px-6 py-4">Gênero</th>
      <th class="px-6 py-4">Ações</th>
    </tr>
  </thead>

<tbody>
  <template v-for="(livro, index) in filteredLivro" :key="index">
    <tr 
      @click="toggleDetalhes(index)" 
      class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
    >
      <td class="px-6 py-4 w-56">
        <div class="flex items-center justify-center gap-2">
          <input 
            type="checkbox" 
            v-model="livro.selecionado" 
            class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            @click.stop
          />
          <span class="invisible">
            <button class="px-3 py-1">Etiquetas</button>
          </span>
        </div>
      </td>
      <td class="px-6 py-4">{{ livro.codigoLivro }}</td>
      <td class="px-6 py-4">{{ livro.exemplar }}</td>
      <td class="px-6 py-4">{{ livro.titulo }}</td>
      <td class="px-6 py-4">{{ livro.autor }}</td>
      <td class="px-6 py-4">{{ livro.Category?.dataValues?.nome || '-' }}</td>
      
      <td class="px-6 py-4 space-x-3">
        <button 
          @click.stop="editarLivro(index)" 
          class="text-blue-600 hover:underline"
        >
          Editar
        </button>
        <button 
          @click.stop="removerLivro(index)" 
          class="text-red-600 hover:underline"
        >
          Remover
        </button>
     <button 
  @click.stop="gerarEtiquetaIndividual(index)" 
  class="text-green-600 hover:underline">
  Etiqueta
</button>

      </td>
    </tr>

    <!-- Detalhes visíveis apenas se for o livro selecionado -->
    <tr v-if="livroAbertoIndex === index">
      <td colspan="9" class="bg-gray-100 dark:bg-gray-700 px-6 py-4">
        <div v-if="livro.imagem" class="mt-4">
          <img :src="'atom:/' + livro.imagem" alt="Imagem do Livro" class="w-64 rounded shadow-lg object-contain" />
          <p><strong>Editora:</strong> {{ livro.editora }}</p>
          <p><strong>Descrição:</strong> {{ livro.descricao }}</p>
        </div>
      </td>
    </tr>
  </template>
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
import ExcelJS from 'exceljs';

export default {
  name: "Livro",
  data() {
    
    return {
      // Formulário
      novoLivro: {
        titulo: "", codigoLivro: "", autor: "", editora: "",
        categoryId: 0, descricao: "", exemplar: "", quantidade: 0,
        imagem: "", imagemOriginal: ""
      },
      livros: [],
      livroAbertoIndex: null,
      categorys: [],
      searchQuery: "",
      editando: false,
      indexEdicao: null,
      currentPage: 1,
      itemsPerPage: 20,
      selectAll: false
    };
  },
  computed: {
    livrosComFiltro() {
      const query = this.searchQuery.toLowerCase();
      return this.livros.filter(livro =>
        livro.titulo.toLowerCase().includes(query) ||
        livro.autor.toLowerCase().includes(query) ||
        livro.codigoLivro.toLowerCase().includes(query)
      );
    },
    filteredLivro() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.livrosComFiltro.slice(start, start + this.itemsPerPage);
    },

    totalPages() {
      return Math.ceil(this.livrosComFiltro.length / this.itemsPerPage) || 1;
    },
    paginasVisiveis() {
      const total = this.totalPages, atual = this.currentPage;
      let inicio = Math.max(atual - 2, 1), fim = Math.min(inicio + 4, total);
      if (fim - inicio < 4) inicio = Math.max(fim - 4, 1);
      return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
    }
  },
  methods: {
  toggleDetalhes(index) {
    this.livroAbertoIndex = this.livroAbertoIndex === index ? null : index;
  },
    toggleSelectAll() {
      this.filteredLivro.forEach(livro => livro.selecionado = this.selectAll);
    },
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
  const path = window.api.getPathInput(event.target);
  if (path) {
    this.novoLivro.imagem = path; // <-- deve ser uma string, tipo "C:/imagens/livro.jpg"
  }
},

    getNomeCategoria(id) {
      const cat = this.categorys.find(c => c.id === id);
      return cat ? cat.nome : '';
    },
    atualizarCategoriaPorNome(nome) {
      const cat = this.categorys.find(c => c.nome === nome);
      this.novoLivro.categoryId = cat ? cat.id : 0;
    },
async gerarEtiquetaIndividual(index) {
  const livro = this.filteredLivro[index];
  await this.gerarEtiquetasExcel([livro]);
},

async gerarEtiquetasSelecionadas() {
  const selecionados = this.livros.filter(l => l.selecionado);
  if (selecionados.length === 0) {
    Swal.fire('Atenção', 'Nenhum livro selecionado!', 'warning');
    return;
  }
  await this.gerarEtiquetasExcel(selecionados);
},

async gerarEtiquetasExcel(livros) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Etiquetas');

  worksheet.columns = [
    { header: 'Código', key: 'codigo', width: 20 },
    { header: 'Exemplar', key: 'exemplar', width: 10 },
    { header: 'Gênero', key: 'genero', width: 30 },
    {}, {}, {}, {},
    { header: 'Nome do Livro', key: 'titulo', width: 40 } 
  ];

  const cores = {
    'Administração e Negócios': 'FFB6C1', 'Agricultura e Meio Ambiente': '98FB98',
    'Artes e Design': 'FFD700', 'Ciência e Tecnologia': '87CEEB',
    'Educação e Didáticos': 'FF69B4', 'Engenharia e Arquitetura': 'FFA07A',
    'Espiritualidade e Religião': '9370DB', 'Filosofia e Psicologia': '40E0D0',
    'História e Sociedade': 'F4A460', 'Direito e Política': 'DC143C',
    'Literatura Clássica e Movimentos Literários': '8B4513',
    'Literatura Brasileira e Estrangeira': 'FF8C00',
    'Ficção e Fantasia': 'FFFF00', 'Romance e Relacionamentos': 'FF0000',
    'Suspense, Terror e Policial': '2F4F4F',
    'Autoajuda e Espiritualidade Pessoal': '9ACD32', 'Infantil e Juvenil': 'FFB347',
    'Quadrinhos e Cultura Pop': '00CED1', 'Biografias e Memórias': 'D2691E',
    'Turismo e Viagens': '1E90FF', 'Poesia': 'DA70D6', 'Peça Teatral': 'A0522D',
    'Comédia': 'FF6F61', 'Outro': 'D3D3D3'
  };

  // Ordenar por título e exemplar
  livros.sort((a, b) => {
    const tituloA = a.titulo?.toLowerCase() || '';
    const tituloB = b.titulo?.toLowerCase() || '';
    if (tituloA !== tituloB) return tituloA.localeCompare(tituloB);
    return Number(a.exemplar) - Number(b.exemplar);
  });

  livros.forEach(livro => {
    const genero = livro.Category?.dataValues?.nome || 'Outro';
    const cor = cores[genero] || 'FFFFFF';

    const row = worksheet.addRow([
      `C. ${livro.codigoLivro}`,
      `EX.${livro.exemplar}`,
      genero,
      '', '', '', '', // espaços
      livro.titulo // Coluna H (index 8)
    ]);

    row.height = 40;

    for (let i = 1; i <= 3; i++) {
      const cell = row.getCell(i);
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = { top: { style: 'thick', color: { argb: '000000' } } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: cor } };
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'etiquetas_livros.xlsx';
  a.click();
  URL.revokeObjectURL(url);
}
,


    async adicionarLivro() {
      if (this.editando) return;

      const base = this.novoLivro;
      const quantidade = parseInt(base.quantidade);
      const numeroInicial = parseInt(base.codigoLivro.match(/\d+$/)) || 1;

      if (base.titulo && base.autor && base.editora && base.categoryId && quantidade > 0) {
        try {
          for (let i = 0; i < quantidade; i++) {
            await window.api.createLivro({
              ...base,
              exemplar: `${numeroInicial + i}`,
              quantidade: 1,
              CategoryId: base.categoryId
            });
          }
          Swal.fire('Sucesso', 'Livros cadastrados com sucesso!', 'success');
          this.resetarFormulario();
          this.carregarLivro();
        } catch (err) {
          console.error(err);
          Swal.fire('Erro', 'Não foi possível cadastrar.', 'error');
        }
      } else {
        Swal.fire('Campos obrigatórios!', 'Preencha todos os campos.', 'warning');
      }
    },
    editarLivro(index) {
  const indexReal = (this.currentPage - 1) * this.itemsPerPage + index;
  this.novoLivro = { ...this.livrosComFiltro[indexReal] };
  this.editando = true;
  this.indexEdicao = indexReal;
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
      const i = (this.currentPage - 1) * this.itemsPerPage + index;
      const livro = this.livrosComFiltro[i];

      const confirm = await Swal.fire({
        title: 'Tem certeza?',
        text: "Deseja remover este livro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar'
      });

      if (confirm.isConfirmed) {
        try {
          await window.api.deleteLivro(livro.id);
          this.carregarLivro();
          Swal.fire('Removido!', 'Livro excluído.', 'success');
        } catch (err) {
          console.error(err);
          Swal.fire('Erro', 'Não foi possível remover.', 'error');
        }
      }
    },
    async carregarLivro() {
      try {
        const livros = await window.api.getLivro();
        this.livros = livros.map(l => ({ ...l, selecionado: false, mostrarDetalhes: false }));
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
    resetarFormulario() {
      this.novoLivro = {
        titulo: "", autor: "", editora: "", categoryId: 0,
        descricao: "", exemplar: "", quantidade: 0,
        imagem: "", imagemOriginal: ""
      };
      this.editando = false;
      this.indexEdicao = null;
      this.currentPage = 1;
    }
  },
  mounted() {
    this.carregarLivro();
    this.carregarCategoria();
  }
};
</script>
