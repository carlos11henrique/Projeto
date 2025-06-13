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
            @click="gerarExcelEtiquetasEmMassa()" 
            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md shadow text-sm"
          >
            Etiquetas
          </button>
        </div>
      </th>
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
    <tr 
      v-for="(livro, index) in filteredLivro" 
      :key="index" 
      class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
    >
      <td class="px-6 py-4 w-56">
        <div class="flex items-center justify-center gap-2">
          <input 
            type="checkbox" 
            v-model="livro.selecionado" 
            class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <!-- Espaço reservado para manter alinhamento, pode ser oculto se não quiser -->
          <span class="invisible">
            <button class="px-3 py-1">Etiquetas</button>
          </span>
        </div>
      </td>
      <td class="px-6 py-4">{{ livro.codigoLivro }}</td>
      <td class="px-6 py-4">{{ livro.exemplar }}</td>
      <td class="px-6 py-4">{{ livro.titulo }}</td>
      <td class="px-6 py-4">{{ livro.autor }}</td>
      <td class="px-6 py-4">{{ livro.editora }}</td>
      <td class="px-6 py-4">{{ livro.Category?.dataValues?.nome || '-' }}</td>
      <td class="px-6 py-4">
        <img 
          v-if="livro.imagem" 
          :src="'atom:/' + livro.imagem" 
          alt="Imagem do Livro" 
          class="h-24 w-auto rounded shadow-md object-contain"
        />
      </td>
      <td class="px-6 py-4 space-x-3">
        <button 
          @click="editarLivro(index)" 
          class="text-blue-600 hover:underline"
        >
          Editar
        </button>
        <button 
          @click="removerLivro(index)" 
          class="text-red-600 hover:underline"
        >
          Remover
        </button>
        <button 
          @click="gerarExcelEtiquetas(index)" 
          class="text-green-600 hover:underline"
        >
          Etiqueta
        </button>
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

import * as XLSX from 'xlsx';


export default {
  name: "Livro",
  data() {
    return {
      novoLivro: {
        titulo: "",
        autor: "",
        editora: "",
        categoryId: 0,
        descricao: "",
        exemplar: "",
        quantidade: 0,
        imagem: "",
        selectAll: false,
        imagemOriginal: ""
        
      },
      livros: [],
      livrosSelecionados: [],
      searchQuery: "",
      categorys: [], 
      editando: false,
      indexEdicao: null,
      
       currentPage: 1,
      itemsPerPage: 20,
    };
  },
  watch: {
    searchQuery() {
      this.currentPage = 1; 
    }
  },
computed: {
  livrosComFiltro() {
    const query = this.searchQuery.toLowerCase();
    return this.livros.filter(livro =>
      livro.titulo.toLowerCase().includes(query) ||
      livro.autor.toLowerCase().includes(query)
    );
  },

  filteredLivro() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.livrosComFiltro.slice(start, end); // depende dele aqui também
  },

  totalPages() {
    return Math.ceil(this.livrosComFiltro.length / this.itemsPerPage) || 1;
  },

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
  }
},

  methods: {
    
async gerarExcelEtiquetas() {
  const livros = this.livros;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Etiquetas');

  const selecionados = this.livros.filter(livro => livro.selecionado);
  if (selecionados.length === 0) {
    Swal.fire('Atenção', 'Nenhum livro selecionado!', 'warning');
    return;
  }

  worksheet.columns = [
    { header: 'Código', key: 'codigo', width: 15 },
    { header: 'Exemplar', key: 'exemplar', width: 10 },
    { header: 'Gênero', key: 'genero', width: 30 },
  ];
  worksheet.getRow(2).height = 25;


  const coresGenero = { 'Administração e Negócios': 'FFB6C1',
    'Agricultura e Meio Ambiente': '98FB98',
    'Artes e Design': 'FFD700',
    'Ciência e Tecnologia': '87CEEB',
    'Educação e Didáticos': 'FF69B4',
    'Engenharia e Arquitetura': 'FFA07A',
    'Espiritualidade e Religião': '9370DB',
    'Filosofia e Psicologia': '40E0D0',
    'História e Sociedade': 'F4A460',
    'Direito e Política': 'DC143C',
    'Literatura Clássica e Movimentos Literários': '8B4513',
    'Literatura Brasileira e Estrangeira': 'FF8C00',
    'Ficção e Fantasia': 'FFFF00',
    'Romance e Relacionamentos': 'FF0000',
    'Suspense, Terror e Policial': '2F4F4F',
    'Autoajuda e Espiritualidade Pessoal': '9ACD32',
    'Infantil e Juvenil': 'FFB347',
    'Quadrinhos e Cultura Pop': '00CED1',
    'Biografias e Memórias': 'D2691E',
    'Turismo e Viagens': '1E90FF',
    'Outro': 'D3D3D3',
  };
selecionados.forEach(livro => {
  const genero = livro.Category?.dataValues?.nome || 'Outro';
  const cor = coresGenero[genero] || 'FFFFFF';

  const row = worksheet.addRow({
    codigo: `C. ${livro.codigoLivro}`,
    exemplar: `EX.${livro.exemplar}`,
    genero,
  });

  // Aumenta a altura da linha
  row.height = 40;

  // Estilo individual de cada célula da linha
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    // Centraliza o conteúdo
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };

    cell.border = {
      top: { style: 'thick', color: { argb: '000000' } },
    };
  });

  const cellGenero = row.getCell(3);
  cellGenero.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: cor },
  };
});


  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'etiquetas_livros.xlsx';
  a.click();
  URL.revokeObjectURL(url);
},


async gerarExcelEtiquetasEmMassa() {
  const selecionados = this.livros.filter(livro => livro.selecionado);

  if (selecionados.length === 0) {
    Swal.fire('Atenção', 'Nenhum livro selecionado!', 'warning');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Etiquetas');

  worksheet.columns = [
    { header: 'Código', key: 'codigo', width: 15 },
    { header: 'Exemplar', key: 'exemplar', width: 10 },
    { header: 'Gênero', key: 'genero', width: 30 },
  ];

  const coresGenero = {  'Administração e Negócios': 'FFB6C1',
    'Agricultura e Meio Ambiente': '98FB98',
    'Artes e Design': 'FFD700',
    'Ciência e Tecnologia': '87CEEB',
    'Educação e Didáticos': 'FF69B4',
    'Engenharia e Arquitetura': 'FFA07A',
    'Espiritualidade e Religião': '9370DB',
    'Filosofia e Psicologia': '40E0D0',
    'História e Sociedade': 'F4A460',
    'Direito e Política': 'DC143C',
    'Literatura Clássica e Movimentos Literários': '8B4513',
    'Literatura Brasileira e Estrangeira': 'FF8C00',
    'Ficção e Fantasia': 'FFFF00',
    'Romance e Relacionamentos': 'FF0000',
    'Suspense, Terror e Policial': '2F4F4F',
    'Autoajuda e Espiritualidade Pessoal': '9ACD32',
    'Infantil e Juvenil': 'FFB347',
    'Quadrinhos e Cultura Pop': '00CED1',
    'Biografias e Memórias': 'D2691E',
    'Turismo e Viagens': '1E90FF',
    'Outro': 'D3D3D3',};

selecionados.forEach(livro => {
  const genero = livro.Category?.dataValues?.nome || 'Outro';
  const cor = coresGenero[genero] || 'FFFFFF';

  const row = worksheet.addRow({
    codigo: `C. ${livro.codigoLivro}`,
    exemplar: `EX.${livro.exemplar}`,
    genero,
  });

  // Aumenta a altura da linha
  row.height = 40;

  // Estilo individual de cada célula da linha
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    // Centraliza o conteúdo
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };

    // Aplica borda superior grossa e preta
    cell.border = {
      top: { style: 'thick', color: { argb: '000000' } },
    };
  });

  // Aplica cor de fundo ao gênero (coluna 3)
  const cellGenero = row.getCell(3);
  cellGenero.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: cor },
  };
});



  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `etiquetas_livros.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
},



     toggleSelectAll() {
    this.filteredLivro.forEach(livro => {
      livro.selecionado = this.selectAll;
    });
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

    async cadastrarEmMassa() {
  if (this.livrosParaCadastrar.length === 0) {
    return Swal.fire("Atenção", "Nenhum livro para cadastrar.", "warning");
  }

  try {
    // Envio para backend via Electron IPC, fetch, ou Axios
    await window.api.cadastrarLivrosEmMassa(this.livrosParaCadastrar);

    Swal.fire("Sucesso", "Livros cadastrados com sucesso!", "success");

    this.livrosParaCadastrar = [];
    this.carregarLivros(); // Atualiza lista principal
  } catch (error) {
    Swal.fire("Erro", "Erro ao cadastrar os livros.", "error");
  }
},
async adicionarLivro() {
  if (this.editando) return; 

  const livroBase = this.novoLivro;
  const quantidade = parseInt(livroBase.quantidade);

  const codigoOriginal = livroBase.codigoLivro || '';
  const numeroInicial = parseInt(codigoOriginal.match(/\d+$/)) || 1;

  if (
    livroBase.titulo && livroBase.autor &&
    livroBase.editora && livroBase.categoryId &&
    quantidade > 0
  ) {
    try {
      for (let i = 0; i < quantidade; i++) {
        const novoExemplar = `${numeroInicial + i}`;

        const novoLivro = {
          ...livroBase,
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
  const indexReal = (this.currentPage - 1) * this.itemsPerPage + index;
  const livro = this.livrosComFiltro[indexReal];

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
        this.livrosComFiltro.splice(indexReal, 1); // atualiza lista
        Swal.fire('Removido!', 'O livro foi removido.', 'success');
        this.carregarLivro();
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível remover o livro.', 'error');
        console.error(error);
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



