<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold mb-6">Estatísticas da Biblioteca</h2>

    <!-- Container Grid com 2 colunas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <!-- Gráfico Ranking de Livros -->
      <div class="flex justify-center items-center">
        <div class="w-full max-w-xl">
          <Chart type="bar" :data="rankingChart.data" :options="rankingChart.options" />
        </div>
      </div>

      <!-- Gráfico de Pizza -->
      <div class="flex justify-center items-center">
        <div class="w-full max-w-xl">
          <Chart type="pie" :data="pieChart.data" :options="pieChart.options" />
        </div>
      </div>

      <!-- Gráfico de Categorias -->
      <div class="flex justify-center items-center">
        <div class="w-full max-w-xl">
          <Chart type="bar" :data="categoriaChart.data" :options="categoriaChart.options" />
        </div>
      </div>

      <!-- Gráfico de Devoluções -->
      <div class="flex justify-center items-center">
        <div class="w-full max-w-xl">
          <Chart type="bar" :data="devolucaoChart.data" :options="devolucaoChart.options" />
        </div>
      </div>

      <!-- Gráfico de Evolução -->
      <div class="flex justify-center items-center">
        <div class="w-full max-w-xl">
          <Chart type="line" :data="lineChart.data" :options="lineChart.options" />
        </div>
      </div>

      <!-- Gráfico de Tempo Médio -->
      <div class="flex justify-center items-center">
        <div class="w-full max-w-xl">
          <Chart type="line" :data="stepChart.data" :options="stepChart.options" />
        </div>
      </div>

      <!-- Gráfico Dias da Semana -->
      <div class="flex justify-center items-center">
        <div class="w-full max-w-xl">
          <Chart type="bar" :data="chartDiasSemana.data" :options="chartDiasSemana.options" />
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'

// Função de animação avançada
const animatedOptions = ({ displayLegend = false, position = 'top', type = 'default' } = {}) => {
  const easing = type === 'pie' ? 'easeOutElastic' :
                 type === 'line' ? 'easeInOutQuart' :
                 type === 'bar' ? 'easeOutBounce' : 'easeInOutExpo';

  return {
    responsive: true,
    animation: {
      duration: 2000,
      easing,
      delay: (ctx) => (ctx.dataIndex ?? 0) * 150,
      onProgress: (animation) => {
        const chart = animation.chart;
        const ctx = chart.ctx;
        ctx.save();
        ctx.globalAlpha = Math.min(1, animation.currentStep / animation.numSteps);
      },
      onComplete: (animation) => {
        const chart = animation.chart;
        const ctx = chart.ctx;
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    },
    elements: {
      bar: {
        borderRadius: 10,
        borderSkipped: false,
      },
      point: {
        radius: 6,
        backgroundColor: '#42A5F5',
        hoverRadius: 10,
        hoverBorderColor: '#fff',
        hoverBorderWidth: 2
      },
      line: {
        borderWidth: 3,
        tension: 0.4,
      },
      arc: {
        borderWidth: 2
      }
    },
    plugins: {
      legend: {
        display: displayLegend,
        position
      },
      tooltip: {
        enabled: true
      }
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: type === 'pie' ? {} : {
      y: {
        beginAtZero: true,
        grace: '10%'
      }
    }
  };
}

// Refs dos gráficos
const rankingChart = ref({ data: {}, options: {} })
const pieChart = ref({ data: {}, options: {} })
const categoriaChart = ref({ data: {}, options: {} })
const devolucaoChart = ref({ data: {}, options: {} })
const lineChart = ref({ data: {}, options: {} })
const stepChart = ref({ data: {}, options: {} })
const chartDiasSemana = ref({
  data: {
    labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    datasets: [{
      label: 'Movimentações por Dia da Semana',
      backgroundColor: '#42A5F5',
      data: [0, 0, 0, 0, 0, 0, 0],
    }]
  },
  options: animatedOptions({ type: 'bar' })
})

// Setters com animações aplicadas
const setRankingChart = (data) => {
  rankingChart.value = {
    data: {
      labels: data.map(i => i.titulo),
      datasets: [{
        label: 'Empréstimos',
        backgroundColor: '#42A5F5',
        data: data.map(i => i.quantidade),
      }]
    },
    options: animatedOptions({ type: 'bar' })
  }
}

const setPieChart = (data) => {
  pieChart.value = {
    data: {
      labels: data.map(i => i.tipo),
      datasets: [{
        data: data.map(i => i.percentual),
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EC407A', '#AB47BC'],
      }]
    },
    options: animatedOptions({ displayLegend: true, position: 'right', type: 'pie' })
  }
}

const setCategoriaChart = (data) => {
  categoriaChart.value = {
    data: {
      labels: data.map(i => i.categoria),
      datasets: [{
        label: 'Empréstimos',
        backgroundColor: '#66BB6A',
        data: data.map(i => i.quantidade),
      }]
    },
    options: animatedOptions({ type: 'bar' })
  }
}

const setDevolucaoChart = (data) => {
  devolucaoChart.value = {
    data: {
      labels: ['No Prazo', 'Fora do Prazo'],
      datasets: [{
        label: 'Devoluções',
        backgroundColor: ['#42A5F5', '#EF5350'],
        data: [data.noPrazo, data.foraPrazo],
      }]
    },
    options: animatedOptions({ type: 'bar' })
  }
}

const setLineChart = (data) => {
  lineChart.value = {
    data: {
      labels: data.map(i => i.mes),
      datasets: [{
        label: 'Empréstimos',
        borderColor: '#42A5F5',
        backgroundColor: '#BBDEFB',
        fill: true,
        tension: 0.4,
        data: data.map(i => i.quantidade),
      }]
    },
    options: animatedOptions({ type: 'line' })
  }
}

const setStepChart = (data) => {
  stepChart.value = {
    data: {
      labels: data.map(i => i.tipo),
      datasets: [{
        label: 'Tempo Médio (dias)',
        borderColor: '#AB47BC',
        backgroundColor: '#E1BEE7',
        fill: false,
        stepped: true,
        data: data.map(i => i.media),
      }]
    },
    options: animatedOptions({ type: 'line' })
  }
}

// Carregamento dos dados
onMounted(async () => {
  try {
    const rankingLivrosAno = await window.api.getRankingLivrosAno();
    const emprestimosCategoria = await window.api.getEmprestimosCategoria();
    const devolucoesPrazo = await window.api.getDevolucoesPrazo();
    const evolucao = await window.api.getEvolucaoEmprestimos();
    const diasSemana = await window.api.getDiasSemanaMovimentados();
    const tempoMedio = await window.api.getTempoMedioUsuario();
    const percentuais = await window.api.getPercentualUsuarios();

    if (rankingLivrosAno?.length)
      setRankingChart(rankingLivrosAno.map(i => ({
        titulo: i.titulo,
        quantidade: i.total_emprestimos
      })));

    if (emprestimosCategoria?.length)
      setCategoriaChart(emprestimosCategoria.map(i => ({
        categoria: i.categoria,
        quantidade: i.total
      })));

    if (devolucoesPrazo?.length)
      setDevolucaoChart({
        noPrazo: devolucoesPrazo.find(i => i.status === 'No Prazo')?.total || 0,
        foraPrazo: devolucoesPrazo.find(i => i.status === 'Em Atraso')?.total || 0
      });

    if (evolucao?.length)
      setLineChart(evolucao.map(i => ({
        mes: i.periodo,
        quantidade: i.total
      })));

    if (tempoMedio?.length)
      setStepChart(tempoMedio.map(i => ({
        tipo: i.tipo_usuario,
        media: i.media_dias
      })));

    if (percentuais?.length) {
      const total = percentuais.reduce((sum, u) => sum + u.total, 0);
      setPieChart(percentuais.map(i => ({
        tipo: i.tipo_usuario,
        percentual: parseFloat((i.total / total * 100).toFixed(2))
      })));
    }

    const totais = [0, 0, 0, 0, 0, 0, 0];
    diasSemana.forEach(item => {
      const idx = parseInt(item.dia_semana);
      if (idx >= 0 && idx <= 6) totais[idx] = item.total;
    });
    chartDiasSemana.value.data.datasets[0].data = totais;

  } catch (error) {
    console.error('Erro ao carregar os dados dos gráficos:', error);
  }
});
</script>
