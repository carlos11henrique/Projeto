<template>
  <div>
    <form @submit.prevent="adicionarUsuario" class="mb-6">
      <!-- Dropdown para selecionar o tipo de usuário -->
      <label class="block mb-4 text-lg font-medium text-gray-900 dark:text-white">Tipo do Usuário</label>
      <select v-model="novoUsuario.tipo" @change="handleTipoUsuarioChange" class="bg-gray-50 border border-gray-300 text-lg text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="">Selecione...</option>
        <option value="Professor">Professor</option>
        <option value="Aluno">Aluno</option>
        <option value="Terceiros">Terceiros</option>
      </select>

      <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label for="nome" class="block mb-3 text-lg font-medium text-gray-900 dark:text-white">Nome Completo</label>
          <input v-model="novoUsuario.nome" type="text" id="nome" class="bg-gray-50 border border-gray-300 text-lg text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3" required />
        </div>
        <div>
          <label for="cpf" class="block mb-3 text-lg font-medium text-gray-900 dark:text-white">CPF</label>
          <input v-model="novoUsuario.cpf" type="text" id="cpf" class="bg-gray-50 border border-gray-300 text-lg text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3" required />
        </div>

        <div v-if="tipoUsuario === 'Aluno'">
          <label for="matricula" class="block mb-3 text-lg font-medium text-gray-900 dark:text-white">Matrícula</label>
          <input v-model="novoUsuario.matricula" type="text" id="matricula" class="bg-gray-50 border border-gray-300 text-lg text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3" required />
        </div>

        <div v-if="tipoUsuario === 'Aluno'">
          <label for="serie" class="block mb-3 text-lg font-medium text-gray-900 dark:text-white">Série</label>
          <input v-model="novoUsuario.serie" type="text" id="serie" class="bg-gray-50 border border-gray-300 text-lg text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3" required />
        </div>
        <div v-if="tipoUsuario === 'Aluno'">
          <label for="turma" class="block mb-3 text-lg font-medium text-gray-900 dark:text-white">Turma</label>
          <input v-model="novoUsuario.turma" type="text" id="turma" class="bg-gray-50 border border-gray-300 text-lg text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3" required />
        </div>

        <div>
          <label for="telefone" class="block mb-3 text-lg font-medium text-gray-900 dark:text-white">Telefone</label>
          <input v-model="novoUsuario.telefone" type="tel" id="telefone" class="bg-gray-50 border border-gray-300 text-lg text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3" required />
        </div>
      </div>

      <div v-if="mensagem" :class="mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="p-5 mb-6 rounded-lg">
        <p class="font-medium text-lg">{{ mensagem.texto }}</p>
      </div>

      <div class="flex gap-5">
        <button
          v-if="!editando"
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold text-lg px-6 py-4 rounded-lg"
        >
          Cadastrar
        </button>

        <button
          v-if="editando"
          @click="atualizarUsuario"
          class="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-semibold text-lg px-6 py-4 rounded-lg"
        >
          Atualizar
        </button>

        <button
          v-if="editando"
          @click="resetForm"
          class="text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-semibold text-lg px-6 py-4 rounded-lg"
        >
          Cancelar
        </button>
      </div>
    </form>

    <div class="mb-5">
      <input
        v-model="termoBusca"
        type="text"
        placeholder="Buscar por nome ou CPF..."
        class="w-full p-3 border border-gray-300 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <table class="w-full text-lg text-left text-gray-500 dark:text-gray-400 mt-6">
      <thead class="text-xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th class="px-8 py-5">Nome</th>
          <th class="px-8 py-5">CPF</th>
          <th v-if="tipoUsuario === 'Aluno'" class="px-8 py-5">Matrícula</th>
          <th v-if="tipoUsuario === 'Aluno'" class="px-8 py-5">Série</th>
          <th v-if="tipoUsuario === 'Aluno'" class="px-8 py-5">Turma</th>
          <th class="px-8 py-5">Telefone</th>
          <th class="px-8 py-5">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(usuario  ) in usuariosPaginados" :key="usuario.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
          <td class="px-8 py-5">{{ usuario?.nome || 'Nome não disponível' }}</td>
          <td class="px-8 py-5">{{ usuario?.cpf }}</td>
          <td v-if="tipoUsuario === 'Aluno'" class="px-8 py-5">{{ usuario.matricula || 'Matrícula não disponível' }}</td>
          <td v-if="tipoUsuario === 'Aluno'" class="px-8 py-5">{{ usuario.serie || 'Série não disponível' }}</td>
          <td v-if="tipoUsuario === 'Aluno'" class="px-8 py-5">{{ usuario.turma || 'Turma não disponível' }}</td>
          <td class="px-8 py-5">{{ usuario?.telefone }}</td>
          <td class="px-8 py-5">
            <button @click="editarUsuario(usuarios.indexOf(usuario))" class="text-blue-600 hover:text-blue-800 font-semibold">Editar</button>
            <button @click="removerUsuario(usuario)" class="text-red-600 hover:text-red-800 font-semibold ml-5">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginação -->
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
      v-for="page in totalPages"
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
import $ from 'jquery';
import 'jquery-mask-plugin';
import Swal from 'sweetalert2';


export default {
  name: "ControleUsuario",
  data() {
    return {
      termoBusca: "",
      editando: false,
      usuarioEditandoId: null,
      usuarios: [],
      tipoUsuario: "",
      novoUsuario: {
        tipo: "",
        nome: "",
        cpf: "",
        matricula: "",
        serie: "",
        turma: "",
        telefone: ""
      },
      mensagem: null,
      paginaAtual: 1,
      itensPorPagina: 20,
    };
  },
  computed: {
    usuariosFiltrados() {
      const busca = this.termoBusca.trim().toLowerCase();
      const buscaNumerica = this.termoBusca.replace(/\D/g, "");

      // Filtra os usuários conforme o termo de busca
      let filtrados = this.usuarios.filter((u) => {
        const nome = u.nome?.toLowerCase() || "";
        const cpf = (u.cpf || "").replace(/\D/g, "");
        const telefone = (u.telefone || "").replace(/\D/g, "");
        const matricula = (u.matricula || "").toLowerCase();

        if (/^\d+$/.test(this.termoBusca)) {
          return (
            cpf.includes(buscaNumerica) ||
            telefone.includes(buscaNumerica) ||
            matricula.includes(buscaNumerica)
          );
        }
        return nome.includes(busca) || matricula.includes(busca);
      });

      // Aplica paginação nos resultados filtrados
      const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
      const fim = inicio + this.itensPorPagina;
      return filtrados.slice(inicio, fim);
    },
    totalPaginas() {
      const busca = this.termoBusca.trim().toLowerCase();
      const buscaNumerica = this.termoBusca.replace(/\D/g, "");

      let filtrados = this.usuarios.filter((u) => {
        const nome = u.nome?.toLowerCase() || "";
        const cpf = (u.cpf || "").replace(/\D/g, "");
        const telefone = (u.telefone || "").replace(/\D/g, "");
        const matricula = (u.matricula || "").toLowerCase();

        if (/^\d+$/.test(this.termoBusca)) {
          return (
            cpf.includes(buscaNumerica) ||
            telefone.includes(buscaNumerica) ||
            matricula.includes(buscaNumerica)
          );
        }
        return nome.includes(busca) || matricula.includes(busca);
      });

      return Math.ceil(filtrados.length / this.itensPorPagina) || 1;
    }
  },
  watch: {
    termoBusca() {
      this.paginaAtual = 1; // Resetar para página 1 ao buscar
    }
  },
  methods: {
    iniciarMascara() {
      this.$nextTick(() => {
        $('#cpf').mask('000.000.000-00');
        $('#telefone').mask('(00) 00000-0000');
      });
    },
    carregarUsuarios() {
      const dados = localStorage.getItem('usuarios');
      if (dados) {
        this.usuarios = JSON.parse(dados);
      }
    },
    salvarUsuarios() {
      localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    },
    handleTipoUsuarioChange() {
      this.tipoUsuario = this.novoUsuario.tipo;
      // Limpar campos específicos se o tipo mudar
      if (this.tipoUsuario !== 'Aluno') {
        this.novoUsuario.matricula = "";
        this.novoUsuario.serie = "";
        this.novoUsuario.turma = "";
      }
    },
    validarCPF(cpf) {
      cpf = cpf.replace(/[^\d]+/g, '');
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

      let soma = 0;
      for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
      let resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.charAt(9))) return false;

      soma = 0;
      for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.charAt(10))) return false;

      return true;
    },
    adicionarUsuario() {
      // Validações
      if (!this.novoUsuario.tipo) {
        this.mensagem = { tipo: 'erro', texto: 'Selecione o tipo de usuário.' };
        return;
      }
      if (!this.novoUsuario.nome) {
        this.mensagem = { tipo: 'erro', texto: 'O nome é obrigatório.' };
        return;
      }
      if (!this.novoUsuario.cpf || !this.validarCPF(this.novoUsuario.cpf)) {
        this.mensagem = { tipo: 'erro', texto: 'CPF inválido.' };
        return;
      }
      if (this.tipoUsuario === 'Aluno') {
        if (!this.novoUsuario.matricula) {
          this.mensagem = { tipo: 'erro', texto: 'Matrícula é obrigatória para alunos.' };
          return;
        }
        if (!this.novoUsuario.serie) {
          this.mensagem = { tipo: 'erro', texto: 'Série é obrigatória para alunos.' };
          return;
        }
        if (!this.novoUsuario.turma) {
          this.mensagem = { tipo: 'erro', texto: 'Turma é obrigatória para alunos.' };
          return;
        }
      }
      if (!this.novoUsuario.telefone) {
        this.mensagem = { tipo: 'erro', texto: 'Telefone é obrigatório.' };
        return;
      }

      // Verifica CPF duplicado
      const cpfLimpo = this.novoUsuario.cpf.replace(/\D/g, '');
      const cpfExiste = this.usuarios.some(u => u.cpf.replace(/\D/g, '') === cpfLimpo);
      if (cpfExiste) {
        this.mensagem = { tipo: 'erro', texto: 'CPF já cadastrado.' };
        return;
      }

      // Adiciona usuário
      this.usuarios.push({...this.novoUsuario});
      this.salvarUsuarios();

      this.mensagem = { tipo: 'sucesso', texto: 'Usuário cadastrado com sucesso!' };
      this.resetForm();
    },
    editarUsuario(index) {
      const usuario = this.usuarios[index];
      this.novoUsuario = { ...usuario };
      this.tipoUsuario = usuario.tipo;
      this.usuarioEditandoId = usuario.id;
      this.editando = true;
      this.usuarioEditandoId = index;
      this.mensagem = null;
      this.$nextTick(() => this.iniciarMascara());
    },
    atualizarUsuario() {
      if (this.usuarioEditandoId === null) return;

      // Validações iguais ao adicionar
      if (!this.novoUsuario.tipo) {
        this.mensagem = { tipo: 'erro', texto: 'Selecione o tipo de usuário.' };
        return;
      }
      if (!this.novoUsuario.nome) {
        this.mensagem = { tipo: 'erro', texto: 'O nome é obrigatório.' };
        return;
      }
      if (!this.novoUsuario.cpf || !this.validarCPF(this.novoUsuario.cpf)) {
        this.mensagem = { tipo: 'erro', texto: 'CPF inválido.' };
        return;
      }
      if (this.tipoUsuario === 'Aluno') {
        if (!this.novoUsuario.matricula) {
          this.mensagem = { tipo: 'erro', texto: 'Matrícula é obrigatória para alunos.' };
          return;
        }
        if (!this.novoUsuario.serie) {
          this.mensagem = { tipo: 'erro', texto: 'Série é obrigatória para alunos.' };
          return;
        }
        if (!this.novoUsuario.turma) {
          this.mensagem = { tipo: 'erro', texto: 'Turma é obrigatória para alunos.' };
          return;
        }
      }
      if (!this.novoUsuario.telefone) {
        this.mensagem = { tipo: 'erro', texto: 'Telefone é obrigatório.' };
        return;
      }

      // Verifica CPF duplicado (exceto o atual)
      const cpfLimpo = this.novoUsuario.cpf.replace(/\D/g, '');
      const cpfExiste = this.usuarios.some((u, i) => i !== this.usuarioEditandoId && u.cpf.replace(/\D/g, '') === cpfLimpo);
      if (cpfExiste) {
        this.mensagem = { tipo: 'erro', texto: 'CPF já cadastrado.' };
        return;
      }

      this.usuarios.splice(this.usuarioEditandoId, 1, {...this.novoUsuario});
      this.salvarUsuarios();

      this.mensagem = { tipo: 'sucesso', texto: 'Usuário atualizado com sucesso!' };
      this.resetForm();
    },

    resetForm() {
      this.novoUsuario = {
        tipo: "",
        nome: "",
        cpf: "",
        matricula: "",
        serie: "",
        turma: "",
        telefone: ""
      };
      this.editando = false;
      this.usuarioEditandoId = null;
      this.tipoUsuario = "";
      this.mensagem = null;
      this.paginaAtual = 1;
      this.$nextTick(() => this.iniciarMascara());
    },
    removerUsuario(usuario) {
      Swal.fire({
        title: 'Tem certeza?',
        text: `Deseja remover o usuário ${usuario.nome}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarios = this.usuarios.filter(u => u !== usuario);
          this.salvarUsuarios();
          Swal.fire('Excluído!', 'Usuário removido com sucesso.', 'success');
          this.paginaAtual = 1;
        }
      });
    },
    paginaAnterior() {
      if (this.paginaAtual > 1) {
        this.paginaAtual--;
      }
    },
    proximaPagina() {
      if (this.paginaAtual < this.totalPaginas) {
        this.paginaAtual++;
      }
    }
  }
}
</script>

<style scoped>

</style>
