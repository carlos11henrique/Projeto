<template>
  <div class="p-6 bg-white rounded shadow-md text-[15px]">
    <h2 class="text-2xl font-semibold mb-4">Lixeira</h2>

    <div v-if="itens.length === 0" class="text-gray-500">Nenhum item na lixeira.</div>

    <table v-else class="w-full text-left border border-gray-200 rounded-lg">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-3 border-b">Tipo</th>
          <th class="p-3 border-b">Informações</th>
          <th class="p-3 border-b">Deletado em</th>
          <th class="p-3 border-b">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in itens" :key="item.id" class="hover:bg-gray-50">
          <td class="p-3 border-b capitalize">{{ item.tipo }}</td>
          <td class="p-3 border-b">
            <div v-if="item.tipo === 'livro'">
              <p><strong>Título:</strong> {{ item.dados.titulo }}</p>
              <p><strong>Autor:</strong> {{ item.dados.autor }}</p>
            </div>
            <div v-else-if="item.tipo === 'usuario'">
              <p><strong>Nome:</strong> {{ item.dados.nome }}</p>
              <p><strong>Tipo:</strong> {{ item.dados.tipo }}</p>
            </div>
          </td>
          <td class="p-3 border-b">{{ formatarData(item.deletado_em) }}</td>
          <td class="p-3 border-b space-x-2">
            <button
              class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              @click="restaurarItem(item.id)"
            >
              Restaurar
            </button>
            <button
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              @click="removerItem(item.id)"
            >
              Remover
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Lixeira",
  data() {
    return {
      itens: [],
    };
  },
  methods: {
    async carregarLixeira() {
      try {
        const response = await fetch("http://localhost:3000/lixeira"); // ajuste se usar IPC ou outra rota
        const dados = await response.json();
        this.itens = dados;
      } catch (error) {
        console.error("Erro ao carregar lixeira:", error);
      }
    },
    async restaurarItem(id) {
      try {
        await fetch(`http://localhost:3000/lixeira/restaurar/${id}`, {
          method: "POST",
        });
        this.itens = this.itens.filter((item) => item.id !== id);
      } catch (error) {
        console.error("Erro ao restaurar item:", error);
      }
    },
    async removerItem(id) {
      try {
        await fetch(`http://localhost:3000/lixeira/${id}`, {
          method: "DELETE",
        });
        this.itens = this.itens.filter((item) => item.id !== id);
      } catch (error) {
        console.error("Erro ao remover item:", error);
      }
    },
    formatarData(data) {
      return new Date(data).toLocaleString("pt-BR");
    },
  },
  mounted() {
    this.carregarLixeira();
  },
};
</script>
