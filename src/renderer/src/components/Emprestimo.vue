<template>
  <div>
    <!-- Pesquisa de Livros -->
    <div class="mb-4">
      <label for="search" class="block text-sm font-medium text-gray-700">Pesquisar Livro (Código, Título ou Autor)</label>
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Digite o código, título ou autor do livro" 
        class="mt-1 p-2 border border-gray-300 rounded-md w-full"
      />
    </div>

    <!-- Lista de Livros -->
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-6 py-3">Código</th>
          <th class="px-6 py-3">Título</th>
          <th class="px-6 py-3">Autor</th>
          <th class="px-6 py-3">Exemplares</th>
          <th class="px-6 py-3">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(livro, index) in filteredLivros" :key="index" class="border-b">
          <td class="px-6 py-4">{{ livro.codigo }}</td>
          <td class="px-6 py-4">{{ livro.titulo }}</td>
          <td class="px-6 py-4">{{ livro.autor }}</td>
          <td class="px-6 py-4">
            {{ livro.exemplares.length > 0 ? livro.exemplares.length : 'Indisponível' }}
          </td>
          <td class="px-6 py-4">
            <button 
              @click="iniciarEmprestimo(livro)" 
              class="bg-blue-500 text-white px-3 py-1 rounded"
            >
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
          <option v-for="exemplar in livroSelecionado.exemplares" :key="exemplar.id" :value="exemplar.id">
            Exemplar {{ exemplar.id }}
          </option>
        </select>
      </div>

      <!-- Pesquisa de Usuário -->
      <div class="mt-4">
        <label class="block text-sm font-medium">Pesquisar Usuário (Matrícula, Nome ou CPF)</label>
        <input 
          v-model="searchUsuario" 
          type="text" 
          placeholder="Digite matrícula, nome ou CPF" 
          class="mt-1 p-2 border rounded-md w-full"
        />
        <ul v-if="filteredUsuarios.length" class="mt-2 border rounded bg-white max-h-32 overflow-y-auto">
          <li 
            v-for="usuario in filteredUsuarios" 
            :key="usuario.matricula" 
            @click="selecionarUsuario(usuario)"
            class="p-2 hover:bg-gray-200 cursor-pointer"
          >
            {{ usuario.nome }} ({{ usuario.matricula }})
          </li>
        </ul>
      </div>

      <!-- Usuário Selecionado -->
      <div v-if="usuarioSelecionado" class="mt-4 p-2 border rounded bg-white">
        <p><strong>Aluno:</strong> {{ usuarioSelecionado.nome }}</p>
        <p><strong>Matrícula:</strong> {{ usuarioSelecionado.matricula }}</p>
      </div>

      <!-- Botão de Empréstimo -->
      <button 
        v-if="livroSelecionadoExemplar && usuarioSelecionado" 
        @click="finalizarEmprestimo" 
        class="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Confirmar Empréstimo
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Emprestimo",
  data() {
    return {
      livros: [
        { 
          codigo: "123", 
          titulo: "Livro A", 
          autor: "Autor A", 
          exemplares: [{ id: 1 }, { id: 2 }, { id: 3 }],  
        },
        { 
          codigo: "456", 
          titulo: "Livro B", 
          autor: "Autor B", 
          exemplares: [{ id: 1 }, { id: 2 }],  
        },
      ],
      usuarios: [
        { matricula: "001", nome: "João Silva", cpf: "123.456.789-00" },
        { matricula: "002", nome: "Maria Oliveira", cpf: "234.567.890-11" },
        { matricula: "003", nome: "Carlos Souza", cpf: "345.678.901-22" },
      ],
      emprestimos: [],
      searchQuery: "", // Pesquisa de livros
      searchUsuario: "", // Pesquisa de usuários
      usuarioSelecionado: null,
      livroSelecionado: null,
      livroSelecionadoExemplar: null,
    };
  },
  computed: {
    filteredLivros() {
      return this.livros.filter(livro => 
        livro.codigo.includes(this.searchQuery) || 
        livro.titulo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        livro.autor.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
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
    iniciarEmprestimo(livro) {
      this.livroSelecionado = livro;
      this.livroSelecionadoExemplar = livro.exemplares.length > 0 ? livro.exemplares[0].id : null;
    },
    selecionarUsuario(usuario) {
      this.usuarioSelecionado = usuario;
    },
    finalizarEmprestimo() {
      if (this.livroSelecionado && this.livroSelecionadoExemplar && this.usuarioSelecionado) {
        alert(`Empréstimo realizado para ${this.usuarioSelecionado.nome} do livro "${this.livroSelecionado.titulo}" (Exemplar ${this.livroSelecionadoExemplar})`);
        
        // Simulação de empréstimo concluído
        this.emprestimos.push({
          livro: this.livroSelecionado,
          exemplar: this.livroSelecionadoExemplar,
          usuario: this.usuarioSelecionado,
        });

        // Resetar os campos após empréstimo
        this.livroSelecionado = null;
        this.livroSelecionadoExemplar = null;
        this.usuarioSelecionado = null;
        this.searchUsuario = "";
      }
    }
  }
};
</script>
