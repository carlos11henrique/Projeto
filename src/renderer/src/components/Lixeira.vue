<template>
  <div class="p-6 bg-white rounded shadow text-[15px]">
    <h2 class="text-2xl font-bold mb-6">Lixeira</h2>

    <!-- Filtros -->
    <div class="flex flex-wrap gap-4 mb-4">
      <input v-model="searchTerm" placeholder="Buscar por nome, título, CPF..." class="p-2 border rounded w-60" />

      <select v-model="filtroTipo" class="p-2 border rounded">
        <option value="">Todos os Tipos</option>
        <option value="aluno">Aluno</option>
        <option value="professor">Professor</option>
        <option value="terceiro">Terceiro</option>
        <option value="livro">Livro</option>
      </select>

      <select v-if="['aluno','professor','terceiro'].includes(filtroTipo)" v-model="filtroSerie" class="p-2 border rounded">
        <option value="">Todas as Séries</option>
        <option v-for="n in 9" :key="n" :value="n">{{ n }}º ano</option>
      </select>

      <button @click="restaurarSelecionados" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Restaurar Selecionados
      </button>

      <button @click="excluirSelecionados" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        Excluir Selecionados
      </button>
    </div>

    <!-- Selecionar Todos Usuários -->
    <div class="flex items-center mb-4" v-if="exibirUsuarios.length > 0">
      <input
        type="checkbox"
        :checked="todosSelecionadosUsuarios"
        @change="alternarSelecaoTodosUsuarios"
        class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded mr-2"
      />
      <label class="text-gray-700 font-medium">Selecionar Todos Usuários</label>
    </div>

    <!-- Usuários -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" v-if="exibirUsuarios.length > 0">
      <div
        v-for="(usuario, index) in usuariosPaginated"
        :key="'usuario-' + usuario.id"
        @click="usuarioAbertoIndex = usuarioAbertoIndex === index ? null : index"
        class="relative p-4 border border-gray-300 rounded shadow cursor-pointer hover:shadow-lg transition"
      >
        <div class="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">Usuário</div>

        <div class="absolute top-2 left-2">
          <input
            type="checkbox"
            :value="{ tipo: 'usuario', id: usuario.id }"
            v-model="itensSelecionados"
            @click.stop
            class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded"
          />
        </div>

        <h2 class="text-lg font-semibold text-center mb-2 break-words">{{ usuario.nome }}</h2>
        <p class="text-sm text-gray-600 text-center mb-1"><strong>CPF:</strong> {{ usuario.cpf || 'Não informado' }}</p>

        <div v-if="usuarioAbertoIndex === index" class="mt-4 text-gray-700 space-y-1">
          <p><strong>Tipo:</strong> {{ usuario.tipo }}</p>
          <p v-if="usuario.tipo === 'aluno'"><strong>Série:</strong> {{ usuario.serie }}º ano</p>
          <p><strong>Telefone:</strong> {{ usuario.telefone || 'Não informado' }}</p>
          <p><strong>Série:</strong> {{ usuario.serie || 'Não informado' }}</p>
          <p><strong>Turma:</strong> {{ usuario.turma || 'Não informado' }}</p>
        </div>

        <div class="mt-4 flex justify-center gap-3 text-sm">
          <button @click.stop="restaurarUsuario(usuario.id)" class="text-green-600 hover:underline">Restaurar</button>
          <button @click.stop="removerUsuario(usuario.id)" class="text-red-600 hover:underline">Remover</button>
        </div>
      </div>
    </div>

    <!-- Paginação Usuários -->
    <div class="flex justify-center items-center gap-4 mt-6" v-if="totalPaginasUsuarios > 1">
      <button
        :disabled="paginaUsuarios === 1"
        @click="paginaUsuarios--"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Anterior
      </button>
      <span>Página {{ paginaUsuarios }} de {{ totalPaginasUsuarios }}</span>
      <button
        :disabled="paginaUsuarios === totalPaginasUsuarios"
        @click="paginaUsuarios++"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Próxima
      </button>
    </div>

    <!-- Selecionar Todos Livros -->
    <div class="flex items-center mb-4 mt-12" v-if="exibirLivros.length > 0">
      <input
        type="checkbox"
        :checked="todosSelecionadosLivros"
        @change="alternarSelecaoTodosLivros"
        class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded mr-2"
      />
      <label class="text-gray-700 font-medium">Selecionar Todos Livros</label>
    </div>

    <!-- Livros -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" v-if="exibirLivros.length > 0">
      <div
        v-for="(livro, index) in livrosPaginated"
        :key="'livro-' + livro.id"
        @click="livroAbertoIndex = livroAbertoIndex === index ? null : index"
        class="relative p-4 border border-gray-300 rounded shadow cursor-pointer hover:shadow-lg transition"
      >
        <div class="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">Livro</div>

        <div class="absolute top-2 left-2">
          <input
            type="checkbox"
            :value="{ tipo: 'livro', id: livro.id }"
            v-model="itensSelecionados"
            @click.stop
            class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded"
          />
        </div>

        <h2 class="text-lg font-semibold text-center mb-2 break-words">{{ livro.titulo }}</h2>
        <p class="text-sm text-gray-600 text-center mb-1"><strong>Código:</strong> {{ livro.codigo }}</p>

        <div v-if="livroAbertoIndex === index" class="mt-4 text-gray-700 space-y-1">
          <div v-if="livro.imagem" class="mt-4 flex gap-4 items-center">
            <img :src="'atom:/' + livro.imagem" alt="Imagem do Livro" class="w-32 rounded shadow-lg object-contain" />
           </div>
          <p><strong>Autor:</strong> {{ livro.autor }}</p>
          <p><strong>Editora:</strong> {{ livro.editora }}</p>
          <p><strong>Descrição:</strong> {{ livro.descricao }}</p>
          <p><strong>Exemplar:</strong> {{ livro.exemplar }}</p>
          <p><strong>Gênero:</strong> {{ livro.Category?.dataValues?.nome || '-' }}</p>
        </div>

        <div class="mt-4 flex justify-center gap-3 text-sm">
          <button @click.stop="restaurarLivro(livro.id)" class="text-green-600 hover:underline">Restaurar</button>
          <button @click.stop="removerLivro(livro.id)" class="text-red-600 hover:underline">Remover</button>
        </div>
      </div>
    </div>

    <!-- Paginação Livros -->
    <div class="flex justify-center items-center gap-4 mt-6" v-if="totalPaginasLivros > 1">
      <button
        :disabled="paginaLivros === 1"
        @click="paginaLivros--"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Anterior
      </button>
      <span>Página {{ paginaLivros }} de {{ totalPaginasLivros }}</span>
      <button
        :disabled="paginaLivros === totalPaginasLivros"
        @click="paginaLivros++"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Próxima
      </button>
    </div>
  </div>
</template>

<script>
  import Swal from "sweetalert2";
export default {
  name: "Lixeira",
  data() {
    return {
      usuarios: [],
      livros: [],
      selecionados: [],
      itensSelecionados: [],
      filtroTipo: "",
      filtroSerie: "",
      searchTerm: "",
      usuarioAbertoIndex: null,
      livroAbertoIndex: null,
      paginaUsuarios: 1,
      paginaLivros: 1,
      itensPorPagina: 9,
    };
  },
  computed: {
    // Filtra usuários ativos inválidos e com filtros aplicados
    exibirUsuarios() {
      let filtrados = this.usuarios.filter(u => u.status === "invalido");

      if (this.filtroTipo && ["aluno","professor","terceiro"].includes(this.filtroTipo)) {
        filtrados = filtrados.filter(u => u.tipo === this.filtroTipo);
      } else if(this.filtroTipo && this.filtroTipo !== "livro") {
        // Se filtroTipo não é livro nem usuario válido, não mostra usuários
        filtrados = [];
      }

      if (this.filtroSerie && this.filtroSerie !== "") {
        filtrados = filtrados.filter(u => u.serie == this.filtroSerie);
      }

      if(this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtrados = filtrados.filter(u =>
          (u.nome && u.nome.toLowerCase().includes(term)) ||
          (u.cpf && u.cpf.toLowerCase().includes(term))
        );
      }
      return filtrados;
    },
    // Filtra livros inválidos com filtros aplicados
    exibirLivros() {
      let filtrados = this.livros.filter(l => l.status === "invalido");

      if (this.filtroTipo === "livro" || this.filtroTipo === "") {
        // mostra livros quando filtroTipo é livro ou vazio (todos)
      } else {
        // se filtroTipo não é livro, não mostra livros
        filtrados = [];
      }

      if(this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtrados = filtrados.filter(l =>
          (l.titulo && l.titulo.toLowerCase().includes(term)) ||
          (l.codigo && l.codigo.toLowerCase().includes(term))
        );
      }

      return filtrados;
    },

    // Paginação usuários
    totalPaginasUsuarios() {
      return Math.max(1, Math.ceil(this.exibirUsuarios.length / this.itensPorPagina));
    },
    usuariosPaginated() {
      const start = (this.paginaUsuarios - 1) * this.itensPorPagina;
      return this.exibirUsuarios.slice(start, start + this.itensPorPagina);
    },

    // Paginação livros
    totalPaginasLivros() {
      return Math.max(1, Math.ceil(this.exibirLivros.length / this.itensPorPagina));
    },
    livrosPaginated() {
      const start = (this.paginaLivros - 1) * this.itensPorPagina;
      return this.exibirLivros.slice(start, start + this.itensPorPagina);
    },

    // Seleção total para usuários
    todosSelecionadosUsuarios() {
      const idsVisiveis = this.usuariosPaginated.map(u => `usuario-${u.id}`);
      const selecionados = this.itensSelecionados.map(i => `${i.tipo}-${i.id}`);
      return idsVisiveis.every(id => selecionados.includes(id)) && idsVisiveis.length > 0;
    },

    // Seleção total para livros
    todosSelecionadosLivros() {
      const idsVisiveis = this.livrosPaginated.map(l => `livro-${l.id}`);
      const selecionados = this.itensSelecionados.map(i => `${i.tipo}-${i.id}`);
      return idsVisiveis.every(id => selecionados.includes(id)) && idsVisiveis.length > 0;
    },
  },
  watch: {
    filtroTipo() {
      this.paginaUsuarios = 1;
      this.paginaLivros = 1;
      this.itensSelecionados = [];
    },
    filtroSerie() {
      this.paginaUsuarios = 1;
      this.itensSelecionados = [];
    },
    searchTerm() {
      this.paginaUsuarios = 1;
      this.paginaLivros = 1;
    },
  },
  methods: {
  async carregarDados() {
  try {
    const [usuarios, livros] = await Promise.all([
      window.api.getUser(),
      window.api.getLivro()
    ]);
    // Filtra só os com status "invalido"
    this.usuarios = usuarios.filter(u => u.status === "invalido");
    this.livros = livros.filter(l => l.status === "invalido");
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
},


    async restaurarSelecionados() {
      if (this.itensSelecionados.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Nenhum item selecionado',
          text: 'Selecione ao menos um item para restaurar.',
        });
        return;
      }

      for (const item of this.itensSelecionados) {
        if (item.tipo === 'usuario') {
          await window.api.updateUser(item.id, 'ativo');
        } else if (item.tipo === 'livro') {
          await window.api.updateLivro(item.id, 'ativo');
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Restaurado!',
        text: 'Itens selecionados foram restaurados com sucesso.',
      });

      this.itensSelecionados = [];
      this.carregarDados();
    },

async restaurarSelecionados() {
  if (this.itensSelecionados.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Nenhum item selecionado',
      text: 'Selecione ao menos um item para restaurar.',
    });
    return;
  }

  for (const item of this.itensSelecionados) {
    if (item.tipo === 'usuario') {
      // Enviando objeto com id e status para atualização
      await window.api.updateUser({ id: item.id, status: 'ativo' });
    } else if (item.tipo === 'livro') {
      // Mesma lógica para livro
      await window.api.updateLivro({ id: item.id, status: 'ativo' });
    }
  }

  Swal.fire({
    icon: 'success',
    title: 'Restaurado!',
    text: 'Itens selecionados foram restaurados com sucesso.',
  });

  this.itensSelecionados = [];
  this.carregarDados();
},


async restaurarLivro(id) {
  const livroAtualizado = { id, status: 'ativo' };
  const result = await window.api.updateLivro(livroAtualizado);
  console.log('Resultado updateLivro:', result);
  Swal.fire('Livro restaurado!', '', 'success');
  this.carregarDados();
},




    async removerUsuario(id) {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação removerá permanentemente o usuário.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        await window.api.deleteUser(id);
        Swal.fire('Removido!', 'O usuário foi excluído.', 'success');
        this.carregarDados();
      }
    },

async restaurarUsuario(id) {
  const result = await window.api.updateUser(id, 'ativo');
  console.log('Resultado updateUser:', result);
  Swal.fire('Usuário restaurado!', '', 'success');
  this.carregarDados();
},


    async removerLivro(id) {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação removerá permanentemente o livro.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        await window.api.deleteLivro(id);
        Swal.fire('Removido!', 'O livro foi excluído.', 'success');
        this.carregarDados();
      }
    },

    alternarSelecaoTodosUsuarios(e) {
      if (e.target.checked) {
        // Adiciona todos os usuários da página aos selecionados (evita duplicatas)
        this.usuariosPaginated.forEach(u => {
          const existe = this.itensSelecionados.find(i => i.tipo === 'usuario' && i.id === u.id);
          if (!existe) this.itensSelecionados.push({ tipo: 'usuario', id: u.id });
        });
      } else {
        // Remove todos os usuários da página dos selecionados
        this.itensSelecionados = this.itensSelecionados.filter(i => !(i.tipo === 'usuario' && this.usuariosPaginated.some(u => u.id === i.id)));
      }
    },

    alternarSelecaoTodosLivros(e) {
      if (e.target.checked) {
        this.livrosPaginated.forEach(l => {
          const existe = this.itensSelecionados.find(i => i.tipo === 'livro' && i.id === l.id);
          if (!existe) this.itensSelecionados.push({ tipo: 'livro', id: l.id });
        });
      } else {
        this.itensSelecionados = this.itensSelecionados.filter(i => !(i.tipo === 'livro' && this.livrosPaginated.some(l => l.id === i.id)));
      }
    },
  },
  mounted() {
    this.carregarDados();
  },
};
</script>
