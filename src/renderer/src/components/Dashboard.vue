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
  // Importando Highcharts e HighchartsVue
  
  export default {
    name: "Dashboard",
    components: {
      highcharts: HighchartsVue.component, // Registrando o componente HighchartsVue localmente
    },
    data() {
      return {
        // Gráfico de Linhas - Evolução dos Empréstimos
        lineChartOptions: {
          chart: {
            type: "line",
          },
          title: {
            text: "Evolução dos Empréstimos",
          },
          xAxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          },
          series: [
            {
              name: "Empréstimos",
              data: [100, 200, 150, 300, 250, 400, 350], // Exemplo de dados de empréstimos mensais
            },
          ],
        },
  
        // Gráfico de Barras - Empréstimos por Categoria
        barChartOptions: {
          chart: {
            type: "bar",
          },
          title: {
            text: "Empréstimos por Categoria",
          },
          xAxis: {
            categories: ["Ficção", "Não Ficção", "Tecnologia", "História"], // Exemplos de categorias de livros
          },
          series: [
            {
              name: "Empréstimos",
              data: [120, 150, 180, 100], // Exemplos de dados de empréstimos por categoria
            },
          ],
        },
  
        // Gráfico de Pizza - Percentual de Empréstimos por Tipo de Usuário
        pieChartOptions: {
          chart: {
            type: "pie",
          },
          title: {
            text: "Percentual de Empréstimos por Tipo de Usuário",
          },
          series: [
            {
              name: "Usuário",
              data: [
                { name: "Professores", y: 40 },  // 40% de empréstimos feitos por professores
                { name: "Alunos", y: 50 },  // 50% de empréstimos feitos por alunos
                { name: "Terceiros", y: 10 },  // 10% de empréstimos feitos por terceiros
              ],
            },
          ],
        },
  
        // Gráfico de Colunas - Devoluções no Prazo vs. Atrasos
        columnChartOptions: {
          chart: {
            type: "column",
          },
          title: {
            text: "Devoluções no Prazo vs. Atrasos",
          },
          xAxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May"],  // Exemplos de meses
          },
          series: [
            {
              name: "Devoluções no Prazo",
              data: [80, 150, 130, 200, 180],  // Exemplo de devoluções no prazo
            },
            {
              name: "Devoluções Atrasadas",
              data: [20, 30, 50, 60, 40],  // Exemplo de devoluções atrasadas
            },
          ],
        },
  
        // Gráfico de Barras Empilhadas - Tempo Médio de Empréstimo por Tipo de Usuário
        stackedBarChartOptions: {
          chart: {
            type: "bar",
          },
          title: {
            text: "Tempo Médio de Empréstimo por Tipo de Usuário",
          },
          xAxis: {
            categories: ["Professores", "Alunos", "Terceiros"],  // Exemplos de tipos de usuários
          },
          series: [
            {
              name: "Tempo Médio (dias)",
              data: [5, 7, 3],  // Exemplo de tempo médio de empréstimo em dias por tipo de usuário
            },
          ],
        },
  
        // Gráfico de Radar - Livros Mais Emprestados
        radarChartOptions: {
          chart: {
            type: "area",
          },
          title: {
            text: "Livros Mais Emprestados",
          },
          xAxis: {
            categories: ["Livro 1", "Livro 2", "Livro 3", "Livro 4", "Livro 5"], // Exemplos de livros mais emprestados
          },
          series: [
            {
              name: "Livros",
              data: [100, 200, 150, 120, 180],  // Exemplo de quantidade de empréstimos por livro
            },
          ],
        },
  
        // Mapa de Calor - Dias da Semana com Mais Empréstimos
        heatMapOptions: {
          chart: {
            type: "heatmap",
          },
          title: {
            text: "Dias da Semana com Mais Empréstimos",
          },
          xAxis: {
            categories: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"], // Exemplos de dias da semana
          },
          yAxis: {
            categories: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"], // Exemplo de semanas
          },
          series: [
            {
              name: "Empréstimos",
              data: [
                [0, 0, 10],
                [1, 0, 15],
                [2, 0, 20],
                [3, 0, 25],
                [4, 0, 30],
                [5, 0, 35],
                [6, 0, 40],
              ],  // Exemplo de dados de empréstimos por dia da semana
            },
          ],
        },
      };
    },
  };
  </script>
  
  <style scoped>
  /* Adicione qualquer estilo necessário para o seu Dashboard */
  </style>
  