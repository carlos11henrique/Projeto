<template>
  <div>
    <h2>Estatísticas da Biblioteca</h2>
    <Chart type="pie" :data="pieChartOptions.data" :options="pieChartOptions.options" />
    <Chart type="bar" :data="barChartOptions.data" :options="barChartOptions.options" />
    <Chart type="line" :data="lineChartOptions.data" :options="lineChartOptions.options" />
    <Chart type="line" :data="stepChartOptions.data" :options="stepChartOptions.options" />
    <Chart type="bar" :data="chartDiasSemana.data" :options="chartDiasSemana.options" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Highcharts from 'highcharts';
import HighchartsVue from "highcharts-vue";
import Chart from 'primevue/chart'

const highcharts = Highcharts;

// Gráficos Highcharts
const pieChartOptions = ref({});
const barChartOptions = ref({});
const lineChartOptions = ref({});
const stepChartOptions = ref({});

// Gráfico PrimeVue
const chartDiasSemana = ref({
  type: 'bar',
  data: {
    labels: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
    datasets: [
      {
        label: 'Movimentações por Dia da Semana',
        backgroundColor: '#42A5F5',
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  }
});

const createHighchartsPie = (data) => {
  pieChartOptions.value = {
    chart: { type: "pie" },
    title: { text: "Percentual por Tipo de Usuário" },
    series: [{
      name: "Usuários",
      colorByPoint: true,
      data: data.map(item => ({
        name: item.tipo,
        y: item.percentual,
      })),
    }],
  };
};

const createHighchartsBar = (data) => {
  barChartOptions.value = {
    chart: { type: "column" },
    title: { text: "Livros Mais Emprestados" },
    xAxis: { categories: data.map(item => item.titulo), title: { text: "Livros" }},
    yAxis: { min: 0, title: { text: "Quantidade de Empréstimos" }},
    series: [{
      name: "Empréstimos",
      data: data.map(item => item.quantidade),
    }],
  };
};

const createHighchartsLine = (data) => {
  lineChartOptions.value = {
    chart: { type: "line" },
    title: { text: "Evolução dos Empréstimos ao Longo do Tempo" },
    xAxis: { categories: data.map(item => item.mes), title: { text: "Mês" }},
    yAxis: { title: { text: "Quantidade de Empréstimos" }},
    series: [{
      name: "Empréstimos",
      data: data.map(item => item.quantidade),
    }],
  };
};

const createHighchartsStep = (data) => {
  stepChartOptions.value = {
    chart: { type: "line" },
    title: { text: "Tempo Médio de Empréstimo por Tipo de Usuário" },
    xAxis: { categories: data.map(item => item.tipo), title: { text: "Tipo de Usuário" }},
    yAxis: { title: { text: "Dias" }},
    plotOptions: { series: { step: "left" }},
    series: [{
      name: "Tempo Médio",
      data: data.map(item => item.media),
    }],
  };
};
const rankingChartOptions = ref({});

const createHighchartsRankingAno = (data) => {
  rankingChartOptions.value = {
    chart: { type: "column" },
    title: { text: "Ranking de Empréstimos no Ano" },
    xAxis: { categories: data.map(item => item.titulo), title: { text: "Livros" } },
    yAxis: { min: 0, title: { text: "Quantidade" } },
    series: [{
      name: "Empréstimos",
      data: data.map(item => item.quantidade),
    }],
  };
};

const categoriaChartOptions = ref({});

const createHighchartsCategoria = (data) => {
  categoriaChartOptions.value = {
    chart: { type: "bar" },
    title: { text: "Empréstimos por Categoria de Livro" },
    xAxis: { categories: data.map(item => item.categoria), title: { text: "Categoria" } },
    yAxis: { min: 0, title: { text: "Quantidade" } },
    series: [{
      name: "Empréstimos",
      data: data.map(item => item.quantidade),
    }],
  };
};
const devolucaoChartOptions = ref({});

const createHighchartsDevolucoes = (data) => {
  devolucaoChartOptions.value = {
    chart: { type: "column" },
    title: { text: "Devoluções no Prazo vs. Fora do Prazo" },
    xAxis: { categories: ["No Prazo", "Fora do Prazo"] },
    yAxis: { min: 0, title: { text: "Quantidade" } },
    series: [{
      name: "Devoluções",
      data: [data.noPrazo, data.foraPrazo],
    }],
  };
};



onMounted(async () => {
  const rankingLivrosAno = await window.api.getRankingLivrosAno();
  const emprestimosCategoria = await window.api.getEmprestimosCategoria();
  const devolucoesPrazo = await window.api.getDevolucoesPrazo();
  const evolucao = await window.api.getEvolucaoEmprestimos();
  const diasSemana = await window.api.getDiasSemanaMovimentados();
  const maisEmprestados = await window.api.getLivrosMaisEmprestados();
  const tempoMedio = await window.api.getTempoMedio();

  createHighchartsRankingAno(rankingLivrosAno);
  createHighchartsCategoria(emprestimosCategoria);
  createHighchartsDevolucoes(devolucoesPrazo);
  createHighchartsLine(evolucao);
  createHighchartsBar(maisEmprestados);
  createHighchartsStep(tempoMedio);



  // Preencher gráfico de dias da semana
  const totais = [0, 0, 0, 0, 0, 0, 0]; // Segunda a Domingo
  diasSemana.forEach(item => {
    const index = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].indexOf(item.dia);
    if (index !== -1) totais[index] = item.quantidade;
  });

  chartDiasSemana.value.data.datasets[0].data = totais;
});
</script>
