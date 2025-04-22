<template>
  <div>
    <!-- Pesquisa de Livros -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Pesquisar Livro</label>
      <input v-model="searchQuery" type="text" placeholder="Código, título ou autor" class="mt-1 p-2 border border-gray-300 rounded-md w-full" />
    </div>

    <!-- Lista de Livros -->
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-6 py-3">Código</th>
          <th class="px-6 py-3">Título</th>
          <th class="px-6 py-3">Autor</th>
          <th class="px-6 py-3">Exemplares</th>
          <th class="px-6 py-3">Usuário com Livro</th>
          <th class="px-6 py-3">Data de Devolução</th>
          <th class="px-6 py-3">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(livro, index) in filteredLivros" :key="index" class="border-b">
          <td class="px-6 py-4">{{ livro.codigo }}</td>
          <td class="px-6 py-4">{{ livro.titulo }}</td>
          <td class="px-6 py-4">{{ livro.autor }}</td>
          <td class="px-6 py-4">{{ livro.exemplares}}</td>
          <td class="px-6 py-4">{{ livro.emprestadoPara ? livro.emprestadoPara.nome : '-' }}</td>
          <td class="px-6 py-4">{{ livro.dataDevolucao || '-' }}</td>
          <td class="px-6 py-4">
            <button v-if="!livro.emprestadoPara" @click="iniciarEmprestimo(livro)" class="bg-blue-500 text-white px-3 py-1 rounded">Emprestar</button>
            <button v-else @click="devolverLivro(livro)" class="bg-red-500 text-white px-3 py-1 rounded">Devolver</button>
            <button v-if="livro.emprestadoPara" @click="aumentarPrazo(livro)" class="bg-yellow-500 text-white px-3 py-1 rounded ml-2">Aumentar Prazo</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="livroSelecionado" class="mt-6 p-4 border rounded bg-gray-100">
      <h3 class="text-lg font-semibold">Livro Selecionado</h3>
      <p><strong>Título:</strong> {{ livroSelecionado.titulo }}</p>
      <p><strong>Autor:</strong> {{ livroSelecionado.autor }}</p>
      <p><strong>Código:</strong> {{ livroSelecionado.codigo }}</p>
      <p><strong>Exemplares:</strong> {{ livroSelecionado.exemplares}}</p>
      <p><strong>Data de Devolução:</strong> {{ livroSelecionado.dataDevolucao || 'Não Emprestado' }}</p>

      <div class="mt-4">
        <h3 class="text-lg font-semibold">Selecionar Usuário</h3>
        <input v-model="searchUsuario" type="text" placeholder="Matrícula, nome ou CPF" class="mt-1 p-2 border rounded-md w-full" />

        <ul v-if="filteredUsuarios.length" class="mt-2 border rounded bg-white max-h-32 overflow-y-auto">
          <li v-for="usuario in filteredUsuarios" :key="usuario.matricula" @click="selecionarUsuario(usuario)" class="p-2 hover:bg-gray-200 cursor-pointer">
            {{ usuario.nome }} ({{ usuario.matricula }})
          </li>
        </ul>

        <button v-if="usuarioSelecionado" @click="finalizarEmprestimo" class="mt-4 bg-green-500 text-white px-4 py-2 rounded">Confirmar Empréstimo</button>
      </div>
    </div>
  </div>
</template>





<script>
export default {
  data() {
    return {
      livros: [],
      usuarios: [],
      searchQuery: "",
      searchUsuario: "",
      livroSelecionado: null,
      usuarioSelecionado: null,
    };
  },
  computed: {
    filteredLivros() {
  return this.livros.filter(livro => {
    const codigo = livro.codigo || '';
    const titulo = livro.titulo || '';
    const autor = livro.autor || '';
    const query = this.searchQuery.toLowerCase();

    return (
      codigo.toString().includes(this.searchQuery) ||
      titulo.toLowerCase().includes(query) ||
      autor.toLowerCase().includes(query)
    );
  });
},
    filteredUsuarios() {
      return this.usuarios.filter(usuario =>
        usuario.nome.toLowerCase().includes(this.searchUsuario.toLowerCase()) ||
        usuario.matricula.toLowerCase().includes(this.searchUsuario.toLowerCase()) ||
        usuario.cpf.includes(this.searchUsuario)
      );
    }
  },
  methods: {
    async carregarLivro() {
      try {
        const livros = await window.api.getLivro();
        this.livros = livros;
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
      }
    },

    async carregarUsuario() {
      try {
        const usuarios = await window.api.getUser();
        this.usuarios = usuarios;
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    },

    async carregarEmprestimos() {
      try {
        const emprestimos = await window.api.getEmprestimo();
        console.log('Empréstimos carregados:', emprestimos);
      } catch (error) {
        console.error('Erro ao carregar empréstimos:', error);
      }
    },

    iniciarEmprestimo(livro) {
      this.livroSelecionado = livro;
      this.searchUsuario = '';
      this.usuarioSelecionado = null;
      this.carregarUsuario();
    },

    selecionarUsuario(usuario) {
      this.usuarioSelecionado = usuario;
      this.searchUsuario = '';
    },

    async finalizarEmprestimo() {
      if (this.livroSelecionado && this.usuarioSelecionado) {
        const dataAtual = new Date();
        const novaData = new Date();
        novaData.setDate(dataAtual.getDate() + 14);

        this.livroSelecionado.emprestadoPara = this.usuarioSelecionado;
        this.livroSelecionado.dataDevolucao = novaData.toISOString().split('T')[0];

        try {
          await window.api.createEmprestimo({
            livroId: this.livroSelecionado.id,
            usuarioId: this.usuarioSelecionado.id,
            dataDevolucao: this.livroSelecionado.dataDevolucao
          });

          alert(`Empréstimo do livro "${this.livroSelecionado.titulo}" para ${this.usuarioSelecionado.nome} até ${this.livroSelecionado.dataDevolucao}`);
        } catch (error) {
          console.error('Erro ao criar empréstimo:', error);
        }
      }

      this.livroSelecionado = null;
      this.usuarioSelecionado = null;
    },

    async devolverLivro(livro) {
      livro.emprestadoPara = null;
      livro.dataDevolucao = null;

      try {
        await window.api.updateEmprestimo({
          livroId: livro.id,
          dataDevolucao: null,
          devolvido: true
        });

        alert(`Livro "${livro.titulo}" devolvido!`);
      } catch (error) {
        console.error('Erro ao devolver livro:', error);
      }
    },

    async aumentarPrazo(livro) {
      if (!livro.dataDevolucao) return;

      try {
        const novaData = new Date(livro.dataDevolucao);
        novaData.setDate(novaData.getDate() + 7);
        livro.dataDevolucao = novaData.toISOString().split('T')[0];

        await window.api.updateEmprestimo({
          livroId: livro.id,
          dataDevolucao: livro.dataDevolucao
        });

        alert(`Prazo aumentado para ${livro.dataDevolucao}`);
      } catch (error) {
        console.error('Erro ao atualizar empréstimo:', error);
      }
    }
  },
  mounted() {
    this.carregarLivro();
    this.carregarEmprestimos();
  }
};
</script>
