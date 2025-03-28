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
          <td class="px-6 py-4">{{ livro.exemplares.length }}</td>
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
    
    <!-- Exibição do Livro Selecionado -->
    <div v-if="livroSelecionado" class="mt-6 p-4 border rounded bg-gray-100">
      <h3 class="text-lg font-semibold">Livro Selecionado</h3>
      <p><strong>Título:</strong> {{ livroSelecionado.titulo }}</p>
      <p><strong>Autor:</strong> {{ livroSelecionado.autor }}</p>
      <p><strong>Código:</strong> {{ livroSelecionado.codigo }}</p>
      <p><strong>Exemplares:</strong> {{ livroSelecionado.exemplares.length }}</p>
      <p><strong>Data de Devolução:</strong> {{ livroSelecionado.dataDevolucao || 'Não Emprestado' }}</p>
    </div>

    <!-- Seção de Pesquisa de Usuários -->
    <div v-if="livroSelecionado" class="mt-6 p-4 border rounded bg-gray-100">
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
</template>

<script>
export default {
  data() {
    return {
      livros: [
        { codigo: "123", titulo: "Livro A", autor: "Autor A", exemplares: [{ id: 1 }, { id: 2 }], emprestadoPara: null, dataDevolucao: null },
        { codigo: "456", titulo: "Livro B", autor: "Autor B", exemplares: [{ id: 1 }], emprestadoPara: null, dataDevolucao: null },
      ],
      usuarios: [
        { matricula: "001", nome: "João Silva", cpf: "123.456.789-00" },
        { matricula: "002", nome: "Maria Oliveira", cpf: "234.567.890-11" },
      ],
      searchQuery: "",
      searchUsuario: "",
      livroSelecionado: null,
      usuarioSelecionado: null,
    };
  },
  computed: {
    filteredLivros() {
      return this.livros.filter(livro => livro.codigo.includes(this.searchQuery) || livro.titulo.toLowerCase().includes(this.searchQuery.toLowerCase()) || livro.autor.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    filteredUsuarios() {
      return this.usuarios.filter(usuario => usuario.nome.toLowerCase().includes(this.searchUsuario.toLowerCase()) || usuario.matricula.toLowerCase().includes(this.searchUsuario.toLowerCase()) || usuario.cpf.includes(this.searchUsuario));
    }
  },
  methods: {
    iniciarEmprestimo(livro) {
      this.livroSelecionado = livro;
    },
    selecionarUsuario(usuario) {
      this.usuarioSelecionado = usuario;
    },
    finalizarEmprestimo() {
      if (this.livroSelecionado && this.usuarioSelecionado) {
        const dataAtual = new Date();
        const novaData = new Date();
        novaData.setDate(dataAtual.getDate() + 14); // 14 dias de prazo padrão
        this.livroSelecionado.emprestadoPara = this.usuarioSelecionado;
        this.livroSelecionado.dataDevolucao = novaData.toISOString().split('T')[0];
        alert(`Empréstimo do livro "${this.livroSelecionado.titulo}" para ${this.usuarioSelecionado.nome} até ${this.livroSelecionado.dataDevolucao}`);
      }
      this.livroSelecionado = null;
      this.usuarioSelecionado = null;
    },
    devolverLivro(livro) {
      livro.emprestadoPara = null;
      livro.dataDevolucao = null;
      alert(`Livro "${livro.titulo}" devolvido!`);
    },
    aumentarPrazo(livro) {
      if (!livro.dataDevolucao) return;
      let novaData = new Date(livro.dataDevolucao);
      novaData.setDate(novaData.getDate() + 7); // Aumenta 7 dias no prazo
      livro.dataDevolucao = novaData.toISOString().split('T')[0];
      alert(`Prazo do livro "${livro.titulo}" estendido até ${livro.dataDevolucao}`);
    }
  }
};
</script>
