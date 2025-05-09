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
      
      <div class="flex gap-4">
  <button
    v-if="!editando"
    type="submit"
    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
  >
    Cadastrar
  </button>
 
  <button
    v-else
    @click="atualizarUsuario"
    class="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5"
  >
    Atualizar
  </button>

  <button
    v-if="editando"
    @click="resetForm"
    class="text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
  >
    Cancelar
  </button>
</div>
   
    </form>
    
    <!-- Tabela de Usuários -->
    <div class="mb-4">
  <input
    v-model="termoBusca"
    type="text"
    placeholder="Buscar por nome ou CPF..."
    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
  />
</div>
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
          <td class="px-6 py-4">{{ usuario?.nome || 'Nome não disponível' }}</td>
          <td class="px-6 py-4">{{ usuario?.cpf }}</td>
          <td v-if="tipoUsuario === 'Aluno'" class="px-6 py-4">{{ usuario.matricula || 'Matricula não disponível' }}</td>
          <td v-if="tipoUsuario === 'Aluno'" class="px-6 py-4">{{ usuario.serie || 'Série não disponível' }}</td>
          <td v-if="tipoUsuario === 'Aluno'" class="px-6 py-4">{{ usuario.turma  || 'Turma não disponível' }}</td>
          <td class="px-6 py-4">{{ usuario?.telefone }}</td>
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
import Swal from 'sweetalert2';

export default {
  name: "ControleUsuario",
    data() {
  return {
    tipoSelecionado: "",
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
    }
  };
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
},


  computed: {
    usuariosFiltrados() {
  let lista = this.usuarios;
  if (this.tipoSelecionado) {
    lista = lista.filter(u => u.tipo === this.tipoSelecionado);
  }
  if (this.termoBusca.trim()) {
    const busca = this.termoBusca.toLowerCase();
    lista = lista.filter(u =>
      (u.nome && u.nome.toLowerCase().includes(busca)) ||
      (u.cpf && u.cpf.includes(busca))
    );
  }
  return lista;
}
  },

  watch: {
    'novoUsuario.tipo'(val) {
      this.tipoSelecionado = val;
    }
  },
  methods: {
    async adicionarUsuario() {
    try {
      const usuarioLimpo = JSON.parse(JSON.stringify(this.novoUsuario));
      await window.api.createUser(usuarioLimpo);
      await this.carregarUsuarios(); // <-- isso só funciona se o método for async
      this.resetForm();

      Swal.fire({
        icon: 'success',
        title: 'Usuário cadastrado!',
        text: 'O usuário foi cadastrado com sucesso.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);

      Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar',
        text: 'Não foi possível cadastrar o usuário. Tente novamente.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Fechar'
      });
    }
  },
async atualizarUsuario() {
  try {
    const usuarioAtualizado = JSON.parse(JSON.stringify(this.novoUsuario));
    usuarioAtualizado.id = this.usuarioEditandoId;

    await window.api.updateUser(usuarioAtualizado);

    // Atualiza a lista local
    const index = this.usuarios.findIndex(u => u.id === usuarioAtualizado.id);
    if (index !== -1) {
      this.usuarios[index] = usuarioAtualizado;
    }

    Swal.fire({
      icon: 'success',
      title: 'Usuário atualizado!',
      text: 'As informações foram alteradas com sucesso.'
    });

    this.resetForm();
    this.editando = false;
    this.usuarioEditandoId = null;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: 'Não foi possível atualizar o usuário.'
    });
  }
},

async editarUsuario(index) {
  const usuario = this.usuarios[index];
  this.novoUsuario = { ...usuario };
  this.tipoUsuario = usuario.tipo;
  this.usuarioEditandoId = usuario.id;
  this.editando = true;
},


    async removerUsuario(usuario) {
      if (confirm("Tem certeza que deseja excluir?")) {
        try {
          await window.api.deleteUser(usuario.id);
          this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
        } catch (error) {
          console.error("Erro ao remover usuário:", error);
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
    }
  },
  async mounted() {
  $(document).ready(() => {
    $('#cpf').mask('000.000.000-00');
    $('#telefone').mask('(00) 00000-0000');
  });

  await this.carregarUsuarios();
  this.resetForm();
}
};
</script>