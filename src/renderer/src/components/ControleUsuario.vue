<template>
  <div>
    
    <form @submit.prevent="adicionarUsuario" class="mb-6">
      <!-- Dropdown para selecionar o tipo de usuário -->
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo do Usuário</label>
      <select v-model="tipoUsuario" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="">Selecione...</option>
        <option value="Professor">Professor</option>
        <option value="Aluno">Aluno</option>
        <option value="Terceiros">Terceiros</option>
      </select>

      <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label for="nome" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome Completo</label>
          <input v-model="novoUsuario.nome" type="text" id="nome" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
        </div>
        <div>
          <label for="CPF" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CPF</label>
          <input v-model="novoUsuario.cpf" type="text" id="cpf" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
        </div>
        
        <div v-if="tipoUsuario === 'Aluno'">
          <label for="matricula" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Matrícula</label>
          <input v-model="novoUsuario.matricula" type="text" id="matricula" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
        </div>
        
        <div v-if="tipoUsuario === 'Aluno'">
          <label for="serie" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Série</label>
          <input v-model="novoUsuario.serie" type="text" id="serie" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
        </div>
        <div v-if="tipoUsuario === 'Aluno'">
          <label for="turma" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Turma</label>
          <input v-model="novoUsuario.turma" type="text" id="turma" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
        </div>

        <div>
          <label for="telefone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefone</label>
          <input v-model="novoUsuario.telefone" type="tel" id="telefone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
        </div>
      </div>
      
      <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5">Cadastrar</button>
    </form>
    
    <!-- Tabela de Usuários -->
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-6">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th class="px-6 py-3">Nome</th>
          <th class="px-6 py-3">CPF</th>
          <th v-if="tipoUsuario === 'Aluno'" class="px-6 py-3">Matrícula</th>
          <th v-if="tipoUsuario === 'Aluno'" class="px-6 py-3">Série</th>
          <th v-if="tipoUsuario === 'Aluno'" class="px-6 py-3">Turma</th>
          <th class="px-6 py-3">Telefone</th>
          <th class="px-6 py-3">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(usuario, index) in usuarios" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <td class="px-6 py-4">{{ usuario.nome }}</td>
          <td class="px-6 py-4">{{ usuario.cpf }}</td>
          <td v-if="tipoUsuario === 'Aluno'" class="px-6 py-4">{{ usuario.matricula }}</td>
          <td v-if="tipoUsuario === 'Aluno'" class="px-6 py-4">{{ usuario.serie }}</td>
          <td v-if="tipoUsuario === 'Aluno'" class="px-6 py-4">{{ usuario.turma }}</td>
          <td class="px-6 py-4">{{ usuario.telefone }}</td>
          <td class="px-6 py-4">
            <button @click="editarUsuario(index)" class="text-blue-600 hover:underline">Editar</button>
            <button @click="removerUsuario(index)" class="text-red-600 hover:underline ml-4">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>      
</template>


<script>
import $ from 'jquery';
import 'jquery-mask-plugin';

export default {
  name: "ControleUsuario",
  data() {
    return {
      tipoUsuario: "", // Estado para armazenar o tipo do usuário
      searchQuery: "",
      usuarios: [],
      novoUsuario: { nome: "", cpf: "", matricula: "", serie: "", turma: "", telefone: "" },
    };
  },
  computed: {
    filteredUsuarios() {
      return this.usuarios.filter(usuario =>
        usuario.nome.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        usuario.matricula.includes(this.searchQuery)
      );
    },
  },
  methods: {
    adicionarUsuario() {
      this.usuarios.push({ ...this.novoUsuario });
      this.novoUsuario = { nome: "", cpf: "", matricula: "", serie: "", turma: "", telefone: "" };
    },
    editarUsuario(index) {
      const usuario = this.usuarios[index];
      const novoNome = prompt("Editar Nome:", usuario.nome);
      if (novoNome !== null) this.usuarios[index].nome = novoNome;
    },
    removerUsuario(index) {
      if (confirm("Tem certeza que deseja remover este usuário?")) {
        this.usuarios.splice(index, 1);
      }
    },
  },
  mounted() {
    $(document).ready(() => {
      $('#cpf').mask('000.000.000-00');
      $('#telefone').mask('(00) 00000-0000');
    });
  }
};
</script>
