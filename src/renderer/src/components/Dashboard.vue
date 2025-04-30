<template>
  <div>
    <!-- Gráfico de Linhas - Evolução dos Empréstimos -->
    <highcharts :options="lineChartOptions" />

    <!-- Gráfico de Barras - Empréstimos por Categoria -->
    <highcharts :options="barChartOptions" />

    <!-- Gráfico de Pizza - Percentual de Empréstimos por Tipo de Usuário -->
    <highcharts :options="pieChartOptions" />

    <!-- Gráfico de Colunas - Devoluções no Prazo vs. Atrasos -->
    <highcharts :options="columnChartOptions" />

    <!-- Gráfico de Barras Empilhadas - Tempo Médio de Empréstimo por Tipo de Usuário -->
    <highcharts :options="stackedBarChartOptions" />

    <!-- Gráfico de Radar - Livros Mais Emprestados -->
    <highcharts :options="radarChartOptions" />

    <!-- Mapa de Calor - Dias da Semana com Mais Empréstimos -->
    <highcharts :options="heatMapOptions" />
  </div>
</template>

<script>
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import Heatmap from "highcharts/modules/heatmap";

export default {
  name: "Dashboard",
  components: {
    highcharts: HighchartsVue.component,
  },
  async mounted() {
    const evolucao = await window.graficosAPI.getEvolucaoEmprestimos();
    const categoria = await window.graficosAPI.getEmprestimosCategoria();
    const percentual = await window.graficosAPI.getPercentualUsuarios();
    const devolucoes = await window.graficosAPI.getDevolucoesPrazo();
    const tempoMedio = await window.graficosAPI.getTempoMedioUsuario();
    const populares = await window.graficosAPI.getLivrosPopulares();
    const diasSemana = await window.graficosAPI.getDiasSemanaMovimentados();

    this.lineChartOptions.series[0].data = evolucao;
    this.barChartOptions.xAxis.categories = categoria.map(item => item.categoria);
    this.barChartOptions.series[0].data = categoria.map(item => item.total);
    this.pieChartOptions.series[0].data = percentual;
    this.columnChartOptions.series[0].data = devolucoes.noPrazo;
    this.columnChartOptions.series[1].data = devolucoes.atrasadas;
    this.stackedBarChartOptions.series[0].data = tempoMedio;
    this.radarChartOptions.xAxis.categories = populares.map(item => item.titulo);
    this.radarChartOptions.series[0].data = populares.map(item => item.total);
    this.heatMapOptions.series[0].data = diasSemana;
  },
  data() {
    return {
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
};
</script>

<style scoped>
/* Adicione estilos personalizados para o Dashboard aqui */
</style>
