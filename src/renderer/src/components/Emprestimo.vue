<template>
    <div>
      <!-- Lista de livros -->
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th class="px-6 py-3">Código</th>
            <th class="px-6 py-3">Título</th>
            <th class="px-6 py-3">Autor</th>
            <th class="px-6 py-3">Editora</th>
            <th class="px-6 py-3">Gênero</th>
            <th class="px-6 py-3">Exemplares</th>
            <th class="px-6 py-3">Imagem</th>
            <th class="px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(livro, index) in filteredLivros" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="px-6 py-4">{{ livro.codigo }}</td>
            <td class="px-6 py-4">{{ livro.titulo }}</td>
            <td class="px-6 py-4">{{ livro.autor }}</td>
            <td class="px-6 py-4">{{ livro.editora }}</td>
            <td class="px-6 py-4">{{ livro.genero }}</td>
            <td class="px-6 py-4">
              <!-- Exibição dos exemplares -->
              <div v-if="livro.exemplares.length > 0">
                <select v-model="livroSelecionadoExemplar" class="p-2 border rounded-md">
                  <option v-for="(exemplar, i) in livro.exemplares" :key="i" :value="exemplar.id">
                    Exemplar {{ exemplar.id }}
                  </option>
                </select>
              </div>
              <div v-else>
                Nenhum exemplar disponível
              </div>
            </td>
            <td class="px-6 py-4"><img :src="livro.imagem" alt="Imagem do Livro" class="h-16 w-auto" /></td>
            <td class="px-6 py-4">
              <!-- Emprestar livro -->
              <button @click="iniciarEmprestimo(livro.codigo)" class="text-green-600 hover:underline ml-3">Emprestar</button>
              <!-- Devolver livro -->
              <button @click="devolverLivro(livro.codigo)" class="text-yellow-600 hover:underline ml-3">Devolver</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Pesquisa de usuário aparece quando "Emprestar" é clicado -->
      <div v-if="mostrarPesquisaUsuario" class="mt-4">
        <label for="usuario" class="block text-sm font-medium text-gray-700">Pesquisar Aluno (Matrícula, Nome ou CPF)</label>
        <input v-model="searchUsuario" type="text" placeholder="Digite matrícula, nome ou CPF do aluno" class="mt-1 p-2 border border-gray-300 rounded-md w-full" />
        
        <!-- Exibe o usuário encontrado -->
        <div v-if="usuarioSelecionado" class="mt-4">
          <p><strong>Aluno Selecionado:</strong> {{ usuarioSelecionado.nome }} - {{ usuarioSelecionado.matricula }}</p>
          <button @click="finalizarEmprestimo" class="text-blue-600 hover:underline mt-2">Confirmar Empréstimo</button>
        </div>
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
          editora: "Editora A", 
          genero: "Ficção", 
          exemplares: [{ id: 1 }, { id: 2 }, { id: 3 }],  // Exemplares do livro
          imagem: "url_image_a" 
        },
        { 
          codigo: "456", 
          titulo: "Livro B", 
          autor: "Autor B", 
          editora: "Editora B", 
          genero: "Romance", 
          exemplares: [{ id: 1 }, { id: 2 }],  // Exemplares do livro
          imagem: "url_image_b" 
        },
        // Adicione mais livros conforme necessário
      ],
      usuarios: [
        { matricula: "001", nome: "João Silva", cpf: "123.456.789-00" },
        { matricula: "002", nome: "Maria Oliveira", cpf: "234.567.890-11" },
        { matricula: "003", nome: "Carlos Souza", cpf: "345.678.901-22" },
        // Adicione mais usuários conforme necessário
      ],
      emprestimos: [],
      searchQuery: "",
      searchUsuario: "",
      usuarioSelecionado: null, // Armazena o usuário que foi selecionado
      mostrarPesquisaUsuario: false, // Controla a exibição da pesquisa de usuário
      livroSelecionado: null, // Armazena o livro selecionado para o empréstimo
      livroSelecionadoExemplar: null, // Armazena o exemplar selecionado
    };
  },
  computed: {
    filteredLivros() {
      return this.livros.filter(livro => 
        livro.titulo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        livro.autor.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    filteredUsuarios() {
      return this.usuarios.filter(usuario =>
        usuario.nome.toLowerCase().includes(this.searchUsuario.toLowerCase()) ||
        usuario.matricula.toLowerCase().includes(this.searchUsuario.toLowerCase()) ||
        usuario.cpf.includes
      );    
    }
  },
};
</script>