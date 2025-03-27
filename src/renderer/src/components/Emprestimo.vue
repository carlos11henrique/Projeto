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
          <th class="px-6 py-3">Usuário Emprestado</th>
          <th class="px-6 py-3">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(livro, index) in filteredLivros" :key="index" class="border-b">
          <td class="px-6 py-4">{{ livro.codigo }}</td>
          <td class="px-6 py-4">{{ livro.titulo }}</td>
          <td class="px-6 py-4">{{ livro.autor }}</td>
          <td class="px-6 py-4">{{ livro.exemplares.length }}</td>
          <td class="px-6 py-4">
            <span v-if="livro.exemplares.some(ex => ex.emprestado)">
              {{ livro.exemplares.filter(ex => ex.emprestado).map(ex => ex.usuarioEmprestado.nome).join(', ') }}
            </span>
            <span v-else>-</span>
          </td>
          <td class="px-6 py-4">
            <button @click="iniciarEmprestimo(livro)" class="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">
              Emprestar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Seção de Empréstimo -->
    <div v-if="livroSelecionado" class="mt-6 p-4 border rounded bg-gray-100">
      <h3 class="text-lg font-semibold">Empréstimo do Livro</h3>
      <p><strong>Título:</strong> {{ livroSelecionado.titulo }}</p>
      <p><strong>Autor:</strong> {{ livroSelecionado.autor }}</p>

      <!-- Escolher exemplar -->
      <div class="mt-2">
        <label class="block text-sm font-medium">Escolher Exemplar:</label>
        <select v-model="livroSelecionadoExemplar" class="mt-1 p-2 border rounded-md w-full">
          <option v-for="exemplar in livroSelecionado.exemplares" :key="exemplar.id" :value="exemplar">
            Exemplar {{ exemplar.id }} - {{ exemplar.emprestado ? "Indisponível" : "Disponível" }}
          </option>
        </select>
      </div>

      <!-- Pesquisa de Usuário -->
      <div class="mt-4">
        <label class="block text-sm font-medium">Pesquisar Usuário</label>
        <input v-model="searchUsuario" type="text" placeholder="Matrícula, nome ou CPF" class="mt-1 p-2 border rounded-md w-full" />
        <ul v-if="filteredUsuarios.length" class="mt-2 border rounded bg-white max-h-32 overflow-y-auto">
          <li v-for="usuario in filteredUsuarios" :key="usuario.matricula" @click="selecionarUsuario(usuario)" class="p-2 hover:bg-gray-200 cursor-pointer">
            {{ usuario.nome }} ({{ usuario.matricula }})
          </li>
        </ul>
      </div>

      <!-- Botão de Empréstimo -->
      <button v-if="livroSelecionadoExemplar && usuarioSelecionado && !livroSelecionadoExemplar.emprestado"
        @click="finalizarEmprestimo"
        class="mt-4 bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
        Confirmar Empréstimo
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      livros: [
        { codigo: "123", titulo: "Livro A", autor: "Autor A", exemplares: [{ id: 1, emprestado: false, usuarioEmprestado: null }, { id: 2, emprestado: false, usuarioEmprestado: null }] },
        { codigo: "456", titulo: "Livro B", autor: "Autor B", exemplares: [{ id: 1, emprestado: false, usuarioEmprestado: null }] },
      ],
      usuarios: [
        { matricula: "001", nome: "João Silva", cpf: "123.456.789-00" },
        { matricula: "002", nome: "Maria Oliveira", cpf: "234.567.890-11" },
      ],
      searchQuery: "",
      searchUsuario: "",
      usuarioSelecionado: null,
      livroSelecionado: null,
      livroSelecionadoExemplar: null,
    };
  },
  computed: {
    filteredLivros() {
      return this.livros.filter(livro => livro.codigo.includes(this.searchQuery) || 
        livro.titulo.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        livro.autor.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    filteredUsuarios() {
      return this.usuarios.filter(usuario => usuario.nome.toLowerCase().includes(this.searchUsuario.toLowerCase()) || 
        usuario.matricula.includes(this.searchUsuario) || 
        usuario.cpf.includes(this.searchUsuario));
    }
  },
  methods: {
    iniciarEmprestimo(livro) {
      this.livroSelecionado = livro;
      this.livroSelecionadoExemplar = livro.exemplares.find(exemplar => !exemplar.emprestado) || null;
    },
    selecionarUsuario(usuario) {
      this.usuarioSelecionado = usuario;
    },
    finalizarEmprestimo() {
      if (this.livroSelecionadoExemplar && this.usuarioSelecionado) {
        this.livroSelecionadoExemplar.emprestado = true;
        this.livroSelecionadoExemplar.usuarioEmprestado = this.usuarioSelecionado;

        const prazoDevolucao = new Date();
        prazoDevolucao.setDate(prazoDevolucao.getDate() + 7);
        alert(`Empréstimo para ${this.usuarioSelecionado.nome}. Devolução até: ${prazoDevolucao.toISOString().split('T')[0]}`);

        this.livroSelecionado = null;
        this.usuarioSelecionado = null;
        this.livroSelecionadoExemplar = null;
      }
    }
  }
};
</script>
