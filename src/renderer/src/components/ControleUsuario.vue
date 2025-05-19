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

<nav class="flex justify-center mt-6" aria-label="Paginação">
  <ul class="inline-flex -space-x-px text-lg">
    <!-- Botão Anterior -->
    <li>
      <button
        @click="paginaAtual--"
        :disabled="paginaAtual === 1"
        class="px-4 py-2 border rounded-l-lg border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
    </li>

    <!-- Páginas visíveis (3 por vez) -->
    <li
      v-for="page in paginasVisiveis"
      :key="page"
    >
      <button
        @click="paginaAtual = page"
        :class="[
          'px-4 py-2 border border-gray-300',
          page === paginaAtual
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-blue-600'
        ]"
      >
        {{ page }}
      </button>
    </li>

    <!-- Botão Próximo -->
    <li>
      <button
        @click="paginaAtual++"
        :disabled="paginaAtual === totalPaginas"
        class="px-4 py-2 border rounded-r-lg border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próximo
      </button>
    </li>
  </ul>
</nav>


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

      // Paginação
      paginaAtual: 1,
      usuariosPorPagina: 20
    };
  },
  computed: {
    usuariosFiltrados() {
    return this.usuarios;
  },
  usuariosPaginados() {
    const start = (this.paginaAtual - 1) * this.usuariosPorPagina;
    return this.usuariosFiltrados.slice(start, start + this.usuariosPorPagina);
  },
  totalPaginas() {
    return Math.ceil(this.usuariosFiltrados.length / this.usuariosPorPagina);
  },
  paginasVisiveis() {
    const total = this.totalPaginas;
    const atual = this.paginaAtual;

    // Lógica para mostrar 3 páginas "deslizantes"
    const inicio = Math.max(atual, 1);
    const paginas = [];

    for (let i = inicio; i < inicio + 5 && i <= total; i++) {
      paginas.push(i);
    }

    return paginas;
  }
},

  watch: {
    termoBusca() {
      this.paginaAtual = 1;
    },
    'novoUsuario.tipo'(val) {
      this.tipoUsuario = val;
    }
  },
  methods: {
    async adicionarUsuario() {
      try {
        const usuarioLimpo = JSON.parse(JSON.stringify(this.novoUsuario));
        await window.api.createUser(usuarioLimpo);
        await this.carregarUsuarios();
        this.resetForm();

        this.mensagem = {
          tipo: 'sucesso',
          texto: 'Usuário cadastrado com sucesso!'
        };

        setTimeout(() => {
          this.mensagem = null;
        }, 5000);
      } catch (error) {
        console.error("Erro ao criar usuário:", error);

        this.mensagem = {
          tipo: 'erro',
          texto: 'Não foi possível cadastrar o usuário. Tente novamente.'
        };
      }
    },

    async atualizarUsuario() {
      try {
        const usuarioAtualizado = JSON.parse(JSON.stringify(this.novoUsuario));
        usuarioAtualizado.id = this.usuarioEditandoId;

        await window.api.updateUser(usuarioAtualizado);

        const index = this.usuarios.findIndex(u => u.id === usuarioAtualizado.id);
        if (index !== -1) {
          this.usuarios.splice(index, 1, usuarioAtualizado);
        }

        this.mensagem = {
          tipo: 'sucesso',
          texto: 'Usuário atualizado com sucesso!'
        };

        this.resetForm();
        this.editando = false;
        this.usuarioEditandoId = null;
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        this.mensagem = {
          tipo: 'erro',
          texto: 'Não foi possível atualizar o usuário.'
        };
      }
    },

    editarUsuario(index) {
      const usuario = this.usuarios[index];
      this.novoUsuario = { ...usuario };
      this.tipoUsuario = usuario.tipo;
      this.usuarioEditandoId = usuario.id;
      this.editando = true;
    },

    async removerUsuario(user) {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter isso!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        try {
          if (!user || !user.id) {
            Swal.fire('Erro!', 'ID inválido.', 'error');
            return;
          }

          await window.api.deleteUser(user.id);
          Swal.fire(
            'Excluído!',
            'O usuário foi excluído com sucesso.',
            'success'
          );
          await this.carregarUsuarios();

          if (this.usuariosPaginados.length === 0 && this.paginaAtual > 1) {
            this.paginaAtual--;
          }
        } catch (error) {
          console.error("Erro ao remover usuário:", error);
          Swal.fire(
            'Erro!',
            'Não foi possível excluir o usuário.',
            'error'
          );
        }
      }
    },

    async carregarUsuarios() {
      try {
        const lista = await window.api.getUser();
        this.usuarios = lista;
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    },

    handleTipoUsuarioChange() {
      this.tipoUsuario = this.novoUsuario.tipo;
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
    },

    goNext() {
      if (this.paginaAtual < this.totalPaginas) {
        this.paginaAtual++;
      }
    },

    goPrevious() {
      if (this.paginaAtual > 1) {
        this.paginaAtual--;
      }
    },

    goToPage(page) {
      this.paginaAtual = page;
    }
  },
  mounted() {
    $(document).ready(() => {
      $('#cpf').mask('000.000.000-00');
      $('#telefone').mask('(00) 00000-0000');
    });

    this.carregarUsuarios();
  }
};
</script>
