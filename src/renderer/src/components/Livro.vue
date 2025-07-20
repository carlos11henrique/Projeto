<template>
  <div class="p-6 bg-white rounded shadow overflow-x-auto text-[15px]">
    <!-- Formulário de Cadastro -->
    <form @submit.prevent="adicionarLivro" class="mb-6">
      <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label for="titulo" class="block mb-2 text-sm font-medium text-gray-900">Título do Livro</label>
          <input v-model="novoLivro.titulo" type="text" id="titulo" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
        </div>

        <div>
          <label for="autor" class="block mb-2 text-sm font-medium text-gray-900">Autor</label>
          <input v-model="novoLivro.autor" type="text" id="autor" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
        </div>

        <div>
          <label for="editora" class="block mb-2 text-sm font-medium text-gray-900">Editora</label>
          <input v-model="novoLivro.editora" type="text" id="editora" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
        </div>

        <div>
          <label for="genero" class="block mb-2 text-sm font-medium text-gray-900">Gênero</label>
          <input
            :value="getNomeCategoria(novoLivro.categoryId)"
            @input="atualizarCategoriaPorNome($event.target.value)"
            list="listaCategorias"
            id="genero"
            name="genero"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="Digite ou selecione um gênero"
          />
          <datalist id="listaCategorias">
            <option v-for="cat in categorys" :key="cat.id" :value="cat.nome"></option>
          </datalist>
        </div>

        <div>
          <label for="descricao" class="block mb-2 text-sm font-medium text-gray-900">Descrição</label>
          <input v-model="novoLivro.descricao" type="text" id="descricao" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
        </div>

        <div>
          <label for="exemplar" class="block mb-2 text-sm font-medium text-gray-900">Exemplar</label>
          <input v-model="novoLivro.exemplar" type="text" id="exemplar" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
        </div>

        <div>
          <label v-if="!editando" for="quantidade" class="block mb-2 text-sm font-medium text-gray-900">Quantidade</label>
          <input v-if="!editando" v-model="novoLivro.quantidade" type="number" id="quantidade" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
        </div>

        <div class="md:col-span-2">
          <label class="block mb-2 text-sm font-medium text-gray-900" for="file_input">Upload Imagem</label>
          <input ref="fileInput" @change="handleImagemSelecionada" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50" id="file_input" type="file" />
        </div>
      </div>

      <!-- Botões de ação do formulário -->
      <div class="flex flex-wrap gap-4 mt-4">
        <button v-if="!editando" type="submit" class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5">
          Cadastrar
        </button>

        <div v-else class="flex flex-wrap gap-4">
          <button @click="salvarEdicaoLivro" type="button" class="text-white bg-green-600 hover:bg-green-700 rounded-lg text-sm px-5 py-2.5">
            Salvar Edição
          </button>
          <button @click="resetarFormulario" type="button" class="text-white bg-gray-500 hover:bg-gray-600 rounded-lg text-sm px-5 py-2.5">
            Cancelar
          </button>
        </div>
      </div>
    </form>

    
  </div>
<div>
    <!-- Formulário de Cadastro -->
    <form @submit.prevent="adicionarLivro" class="mb-6">
      <!-- ... o conteúdo do formulário permanece o mesmo ... -->
    </form>

<div class="flex flex-wrap items-center justify-between mb-4 gap-2">
  <div class="flex flex-wrap gap-2">
    <button 
      @click="removerSelecionados" 
      class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm shadow"
    >
      Excluir Selecionados
    </button>
    <button 
      @click="gerarEtiquetasSelecionadas" 
      class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm shadow"
    >
      Gerar Etiquetas
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
    <template v-for="(livro, index) in filteredLivro" :key="index">
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
          <button @click.stop="editarLivro(livro)" class="text-blue-600 hover:underline">Editar</button>
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
      livrosSelecionados: [],
      categorys: [],
      searchQuery: "",
      editando: false,
      indexEdicao: null,
      currentPage: 1,
      itemsPerPage: 20,
      selectAll: false
    };
  },

  watch: {
    'novoLivro.titulo': {
      handler(novoTitulo) {
        this.verificarLivroExistente(novoTitulo);
      },
      immediate: false,
    },
  },
computed: {
  livrosComFiltro() {
    const query = this.searchQuery?.toLowerCase() || '';

    const filtrados = this.livros.filter(livro =>
      (livro.titulo?.toLowerCase() || '').includes(query) ||
      (livro.autor?.toLowerCase() || '').includes(query) ||
      (livro.codigoLivro?.toLowerCase() || '').includes(query)
    );

    return filtrados.sort((a, b) => {
      const tituloA = a.titulo?.toLowerCase() || '';
      const tituloB = b.titulo?.toLowerCase() || '';

      if (tituloA !== tituloB) {
        return tituloA.localeCompare(tituloB);
      }

      return (Number(a.exemplar) || 0) - (Number(b.exemplar) || 0);
    });
  },

  filteredLivro() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.livrosComFiltro.slice(start, start + this.itemsPerPage);
  },
todosSelecionados() {
  return (
    this.filteredLivro.length > 0 &&
    this.filteredLivro.every(livro => this.livrosSelecionados.includes(livro))
  );
},
  todosSelecionados() {
    return this.livros.length > 0 && this.livrosSelecionados.length === this.livros.length;
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
selecionarTodos(event) {
    const selecionado = event.target.checked;

    this.filteredLivro.forEach(livro => {
      if (selecionado && !this.livrosSelecionados.includes(livro)) {
        this.livrosSelecionados.push(livro);
      } else if (!selecionado) {
        this.livrosSelecionados = this.livrosSelecionados.filter(l => l !== livro);
      }
    });
  },
  toggleDetalhes(index) {
    if (this.livroAbertoIndex === index) {
      this.livroAbertoIndex = null;
    } else {
      this.livroAbertoIndex = index;
    }
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
    this.novoLivro.imagem = path; 
  }
},
editarLivro(livro) {
    this.editando = true;
    // Clona o livro selecionado para o formulário
    this.novoLivro = JSON.parse(JSON.stringify(livro));
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
    {},
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
    '', // espaços
    livro.titulo.slice(0, 17) // Limita o título a 17 caracteres
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
},

async verificarLivroExistente(titulo) {
    if (!titulo || titulo.length < 3) return; // Evita buscas muito curtas

    try {
      const livroExistente = await window.api.buscarLivroPorTitulo(titulo.trim());

      if (livroExistente) {
        // Preenche os campos com dados existentes
        this.novoLivro = {
          ...livroExistente,
          quantidade: '', // Deixa a quantidade para o usuário preencher
          exemplar: '',   // Será gerado dinamicamente
        };

        this.livroExistente = livroExistente; // Armazena para usar depois no cadastro
      } else {
        this.livroExistente = null; // Nada encontrado
      }
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
    }
  },

async adicionarLivro() {
  if (this.editando) return;

  const base = this.novoLivro;
  const quantidade = parseInt(base.quantidade);
console.log(this.novoLivro);
  if (!base.titulo || quantidade <= 0) {
    return Swal.fire('Campos obrigatórios!', 'Preencha o título e a quantidade.', 'warning');
  }

  try {
    let dadosParaUsar = { ...base };
    let exemplarInicial = 1;

    if (this.livroExistente) {
      // Livro já existe → usar os dados dele
      dadosParaUsar = { ...this.livroExistente };

      // Buscar último exemplar corretamente
      const ultimoExemplar = await window.api.buscarUltimoExemplar(dadosParaUsar.titulo);
      exemplarInicial = ultimoExemplar + 1;

    } else {
      // Gerar código base único para novo livro (ex: L123)
      const random = Math.floor(100 + Math.random() * 900);
      dadosParaUsar.codigo = `L${random}`;
    }

    for (let i = 0; i < quantidade; i++) {
      const exemplar = exemplarInicial + i;

      await window.api.createLivro({
        ...dadosParaUsar,
        exemplar,
        quantidade: 1,
       categoryId: dadosParaUsar.categoryId,
        codigo: `${dadosParaUsar.codigo}-${exemplar}` // gerar código único por exemplar
      });
    }

    Swal.fire('Sucesso', 'Livros cadastrados com sucesso!', 'success');
    this.resetarFormulario();
    this.carregarLivro();

  } catch (err) {
    console.error(err);
    Swal.fire('Erro', 'Não foi possível cadastrar.', 'error');
  }
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
 toggleTodosLivros(event) {
    if (event.target.checked) {
      this.livrosSelecionados = [...this.livros];
    } else {
      this.livrosSelecionados = [];
    }
  },
async removerSelecionados() {
  try {
    if (!this.livrosSelecionados || this.livrosSelecionados.length === 0) {
      return Swal.fire('Atenção', 'Nenhum livro selecionado.', 'warning');
    }

    const confirmacao = await Swal.fire({
      title: 'Tem certeza?',
      text: `Você deseja mover ${this.livrosSelecionados.length} livro(s) para a lixeira?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, mover',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmacao.isConfirmed) return;

    for (const livro of this.livrosSelecionados) {
      const copiaLivro = JSON.parse(JSON.stringify(livro)); // 🔥 Aqui está o pulo do gato
      copiaLivro.status = 'invalido';
      await window.api.updateLivro(copiaLivro);
    }

    Swal.fire('Movido!', 'Livros enviados para a lixeira com sucesso.', 'success');
    this.livrosSelecionados = [];
    this.carregarLivro();

  } catch (error) {
    console.error('Erro ao mover livros para lixeira:', error);
    Swal.fire('Erro!', 'Não foi possível mover os livros para a lixeira.', 'error');
  }
},

    async carregarLivro() {
  try {
    const livros = await window.api.getLivro();

    // Filtra apenas os livros que NÃO têm status "invalido"
    const livrosValidos = livros.filter(l => l.status !== 'invalido');

    // Adiciona os campos adicionais
    this.livros = livrosValidos.map(l => ({
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
