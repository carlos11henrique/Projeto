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
  data() {
    return {
      lineChartOptions: {
        chart: { type: "line" },
        title: { text: "Evolução dos Empréstimos" },
        xAxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"] },
        yAxis: { title: { text: "Número de Empréstimos" } },
        series: [{ name: "Empréstimos", data: [100, 200, 150, 300, 250, 400, 350] }],
      },
      barChartOptions: {
        chart: { type: "bar" },
        title: { text: "Empréstimos por Categoria" },
        xAxis: { categories: ["Ficção", "Não Ficção", "Tecnologia", "História"] },
        yAxis: { title: { text: "Número de Empréstimos" } },
        series: [{ name: "Empréstimos", data: [120, 150, 180, 100] }],
      },
      pieChartOptions: {
        chart: { type: "pie" },
        title: { text: "Percentual de Empréstimos por Tipo de Usuário" },
        series: [{
          name: "Usuário",
          data: [
            { name: "Professores", y: 40 },
            { name: "Alunos", y: 50 },
            { name: "Terceiros", y: 10 },
          ],
        }],
      },
      columnChartOptions: {
        chart: { type: "column" },
        title: { text: "Devoluções no Prazo vs. Atrasos" },
        xAxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May"] },
        yAxis: { title: { text: "Quantidade" } },
        series: [
          { name: "No Prazo", data: [80, 150, 130, 200, 180] },
          { name: "Atrasadas", data: [20, 30, 50, 60, 40] },
        ],
      },
      stackedBarChartOptions: {
        chart: { type: "bar" },
        title: { text: "Tempo Médio de Empréstimo por Tipo de Usuário" },
        xAxis: { categories: ["Professores", "Alunos", "Terceiros"] },
        yAxis: { title: { text: "Tempo Médio (dias)" } },
        series: [{ name: "Tempo Médio", data: [5, 7, 3] }],
      },
      radarChartOptions: {
        chart: { type: "area" },
        title: { text: "Livros Mais Emprestados" },
        xAxis: { categories: ["Livro 1", "Livro 2", "Livro 3", "Livro 4", "Livro 5"] },
        yAxis: { title: { text: "Empréstimos" } },
        series: [{ name: "Livros", data: [100, 200, 150, 120, 180] }],
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
          data: [
            [0, 0, 10], [1, 0, 15], [2, 0, 20], [3, 0, 25], [4, 0, 30], [5, 0, 35], [6, 0, 40],
            [0, 1, 12], [1, 1, 18], [2, 1, 22], [3, 1, 28], [4, 1, 35], [5, 1, 40], [6, 1, 45],
          ],
        }],
      },
    };
  },
};
</script>

<style scoped>
/* Adicione estilos personalizados para o Dashboard aqui */
</style>