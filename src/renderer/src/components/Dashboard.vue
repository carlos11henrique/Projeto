<template>
  <div>
    <!-- Gráficos -->
    <highcharts :options="lineChartOptions" />
    <highcharts :options="barChartOptions" />
    <highcharts :options="pieChartOptions" />
    <highcharts :options="columnChartOptions" />
    <highcharts :options="stackedBarChartOptions" />
    <highcharts :options="radarChartOptions" />
    <highcharts :options="heatMapOptions" />
  </div>
</template>

<script>
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import Heatmap from "highcharts/modules/heatmap"; // Importando o módulo Heatmap corretamente

export default {
  name: "Dashboard",
  components: {
    highcharts: HighchartsVue.component,
  },
  data() {
    return {

      // Definindo as opções dos gráficos
      lineChartOptions: {
        chart: { type: "line" },
        title: { text: "Evolução dos Empréstimos" },
        xAxis: { categories: [] },
        yAxis: { title: { text: "Número de Empréstimos" } },
        series: [{ name: "Empréstimos", data: [] }],
      },
      barChartOptions: {
        chart: { type: "bar" },
        title: { text: "Empréstimos por Categoria" },
        xAxis: { categories: [] },
        yAxis: { title: { text: "Número de Empréstimos" } },
        series: [{ name: "Empréstimos", data: [] }],
      },
      pieChartOptions: {
        chart: { type: "pie" },
        title: { text: "Percentual de Empréstimos por Tipo de Usuário" },
        series: [{ name: "Usuário", data: [] }],
      },
      columnChartOptions: {
        chart: { type: "column" },
        title: { text: "Devoluções no Prazo vs. Atrasos" },
        xAxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May"] },
        yAxis: { title: { text: "Quantidade" } },
        series: [
          { name: "No Prazo", data: [] },
          { name: "Atrasadas", data: [] },
        ],
      },
      stackedBarChartOptions: {
        chart: { type: "bar" },
        title: { text: "Tempo Médio de Empréstimo por Tipo de Usuário" },
        xAxis: { categories: ["Professores", "Alunos", "Terceiros"] },
        yAxis: { title: { text: "Tempo Médio (dias)" } },
        series: [{ name: "Tempo Médio", data: [] }],
      },
      radarChartOptions: {
        chart: { type: "area" },
        title: { text: "Livros Mais Emprestados" },
        xAxis: { categories: [] },
        yAxis: { title: { text: "Empréstimos" } },
        series: [{ name: "Livros", data: [] }],
      },
      heatMapOptions: {
        chart: { type: "heatmap" },
        title: { text: "Dias da Semana com Mais Empréstimos" },
        xAxis: { categories: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"] },
        yAxis: { categories: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"], title: { text: "Semanas" } },
        colorAxis: { min: 0, minColor: "#FFFFFF", maxColor: "#FF0000" },
        series: [{
          name: "Empréstimos",
          borderWidth: 1,
          data: [],
        }],
      },
    };
  },
  async mounted() {
  // Carregar os dados de várias fontes
  try {
    const evolucao = await window.api.getEvolucaoEmprestimos();
    const categoria = await window.api.getEmprestimosCategoria();
    const percentual = await window.api.getPercentualUsuarios();
    const devolucoes = await window.api.getDevolucoesPrazo();
    const tempoMedio = await window.api.getTempoMedioUsuario();
    const populares = await window.api.getLivrosPopulares();
    const diasSemana = await window.api.getDiasSemanaMovimentados();

    // Verificando e ajustando os dados para o heatmap
    const heatmapData = diasSemana.map(item => {
      const x = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].indexOf(item.dia);
      const y = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"].indexOf(item.semana);
      return [x, y, item.quantidade]; // Formato [x, y, value]
    });

    // Atualizando as opções dos gráficos
    this.lineChartOptions.series[0].data = evolucao;
    this.barChartOptions.xAxis.categories = categoria.map(item => item.categoria);
    this.barChartOptions.series[0].data = categoria.map(item => item.total);
    this.pieChartOptions.series[0].data = percentual;
    this.columnChartOptions.series[0].data = devolucoes.noPrazo;
    this.columnChartOptions.series[1].data = devolucoes.atrasadas;
    this.stackedBarChartOptions.series[0].data = tempoMedio;
    this.radarChartOptions.xAxis.categories = populares.map(item => item.titulo);
    this.radarChartOptions.series[0].data = populares.map(item => item.total);

    // Atualizando o gráfico de heatmap com os dados ajustados
    this.heatMapOptions.series[0].data = heatmapData;

  } catch (error) {
    console.error('Erro ao carregar os dados para os gráficos:', error);
  }
},
};
</script>




<style scoped>
/* Adicione estilos personalizados para o Dashboard aqui */
</style>
