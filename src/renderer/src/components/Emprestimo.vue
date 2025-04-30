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
          <th class="px-6 py-3">Genero</th>
          <th class="px-6 py-3">Exemplares</th>
          <th class="px-6 py-3">Usuário com Livro</th>
          <th class="px-6 py-3">Data de Devolução</th>
          <th class="px-6 py-3">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(livro, index) in filteredLivros" :key="index" class="border-b">
          <td class="px-6 py-4">{{ livro.codigoLivro }}</td>
          <td class="px-6 py-4">{{ livro.titulo }}</td>
          <td class="px-6 py-4">{{ livro.autor }}</td>
          <td class="px-6 py-4">{{ livro.genero }}</td>
          <td class="px-6 py-4">{{ livro.exemplar }}</td>
          <td class="px-6 py-4">{{ livro.emprestadoPara ? livro.emprestadoPara.nome : '-' }}</td>
          <td
            class="px-6 py-4"
            :class="{ 'text-red-600 font-semibold': isAtrasado(livro.dataDevolucao) }"
          >
            {{ livro.dataDevolucao || '-' }}
          </td>
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
      <p><strong>Gênero:</strong> {{ livroSelecionado.genero }}</p>
      <p><strong>Código:</strong> {{ livroSelecionado.codigoLivro }}</p>
      <p><strong>Exemplares:</strong> {{ livroSelecionado.exemplar }}</p>
      <p><strong>Data de Devolução:</strong> {{ livroSelecionado.dataDevolucao || 'Não Emprestado' }}</p>
      <p><strong>Usuário:</strong> {{ livroSelecionado.emprestadoPara ? livroSelecionado.emprestadoPara.nome : 'Ninguém' }}</p>
      <p><strong>Situação do Livro :</strong> {{ livroSelecionado.status || (livroSelecionado.emprestadoPara ? 'Emprestado' : 'Disponível') }}</p>

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
import Swal from 'sweetalert2';

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
      const query = this.searchQuery.toLowerCase();
      const livrosFiltrados = this.livros.filter(livro => {
        const codigoLivro = livro.codigoLivro || '';
        const titulo = livro.titulo || '';
        const autor = livro.autor || '';
        return (
          codigoLivro.toString().includes(this.searchQuery) ||
          titulo.toLowerCase().includes(query) ||
          autor.toLowerCase().includes(query)
        );
      });

      const emprestados = livrosFiltrados.filter(livro => livro.status === 'emprestado');
      const disponiveis = livrosFiltrados.filter(livro => livro.status !== 'emprestado');

      return [...emprestados, ...disponiveis];
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
        this.livros = livros.map(livro => ({ ...livro, status: 'disponivel' }));
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

    this.livros.forEach(livro => {
      const emprestimoAtivo = emprestimos.find(e => e.LivroId === livro.id && e.status === 'emprestado');
      if (emprestimoAtivo) {
        const usuario = this.usuarios.find(u => u.id === emprestimoAtivo.UsuarioId);
        livro.emprestadoPara = usuario || { nome: 'Desconhecido' };

        // ✅ Formatar a data de devolução para o formato brasileiro
        const dataFormatada = new Date(emprestimoAtivo.dataDevolucao).toLocaleDateString('pt-BR');
        livro.dataDevolucao = dataFormatada;

        livro.status = 'emprestado';
        livro.emprestimoId = emprestimoAtivo.id;
      } else {
        livro.emprestadoPara = null;
        livro.dataDevolucao = null;
        livro.status = 'disponivel';
        livro.emprestimoId = null;
      }
    });
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
    const dataFormatada = novaData.toLocaleDateString('pt-BR');

    try {
      await window.api.createEmprestimo({
        LivroId: this.livroSelecionado.id,
        UsuarioId: this.usuarioSelecionado.id,
        dataDevolucao: novaData.toISOString().split('T')[0],
        status: 'emprestado'
      });

      // ✅ SweetAlert2
      Swal.fire({
        title: '📚 Empréstimo Realizado!',
        html: `
          <div style="font-size: 16px;">
            <strong>Livro:</strong> <span style="color: #3b82f6;">"${this.livroSelecionado.titulo}"</span><br/>
            <strong>Usuário:</strong> ${this.usuarioSelecionado.nome}<br/>
            <strong>Devolução até:</strong> <span style="color: #10b981;">${dataFormatada}</span>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#10b981',
        background: '#f0fdf4',
        customClass: {
          popup: 'rounded-xl shadow-lg',
        }
      });

      this.livroSelecionado = null;
      this.usuarioSelecionado = null;

      await this.carregarEmprestimos();
    } catch (error) {
      console.error('Erro ao criar empréstimo:', error);
    }
  }
},


async devolverLivro(livro) {
  try {
    await window.api.updateEmprestimo({
      id: livro.emprestimoId,
      LivroId: livro.id,
      dataDevolucao: new Date().toISOString().split('T')[0],
      devolvido: true,
      status: 'disponivel'
    });

    Swal.fire({
      title: '✅ Livro Devolvido!',
      html: `
        <div style="font-size: 16px;">
          <strong>Título:</strong> <span style="color: #3b82f6;">"${livro.titulo}"</span><br/>
          <strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#3b82f6',
      background: '#eff6ff',
      customClass: {
        popup: 'rounded-xl shadow-lg',
      }
    });

    await this.carregarEmprestimos();
  } catch (error) {
    console.error('Erro ao devolver livro:', error);
  }
},


isAtrasado(dataDevolucao) {
  if (!dataDevolucao) return false;

  const partes = dataDevolucao.split('/');
  const dataFormatada = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
  const hoje = new Date();

  hoje.setHours(0, 0, 0, 0);
  dataFormatada.setHours(0, 0, 0, 0);

  return dataFormatada < hoje;
},

async aumentarPrazo(livro) {
  if (!livro.dataDevolucao || !livro.emprestimoId) return;

  try {
    // ✅ Corrigir o formato "dd/mm/aaaa" para Date válida
    const partes = livro.dataDevolucao.split('/');
    const dataISO = `${partes[2]}-${partes[1]}-${partes[0]}`;
    const novaData = new Date(dataISO);

    // ✅ Adicionar 7 dias
    novaData.setDate(novaData.getDate() + 7);

    await window.api.updateEmprestimo({
      id: livro.emprestimoId,
      LivroId: livro.id,
      dataDevolucao: novaData.toISOString().split('T')[0],
      status: 'emprestado'
    });

    Swal.fire({
      title: '📅 Prazo Estendido!',
      html: `
        <div style="font-size: 16px;">
          <strong>Livro:</strong> <span style="color: #3b82f6;">"${livro.titulo}"</span><br/>
          <strong>Nova data de devolução:</strong> <span style="color: #10b981;">${novaData.toLocaleDateString('pt-BR')}</span>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#10b981',
      background: '#ecfdf5',
      customClass: {
        popup: 'rounded-xl shadow-lg',
      }
    });

    await this.carregarEmprestimos();
  } catch (error) {
    console.error('Erro ao atualizar empréstimo:', error);
  }
}

  },
  async mounted() {
    await this.carregarLivro();
    await this.carregarUsuario();
    await this.carregarEmprestimos();
  }
};
</script>