import Highcharts from 'highcharts';

<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold mb-6">Estatísticas da Biblioteca</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div v-for="(chart, index) in charts" :key="index" class="flex justify-center items-center">
        <div :id="chart.id" class="w-full max-w-xl"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import Highcharts from 'highcharts';

const charts = reactive([
  { id: 'rankingChart' },
  { id: 'rankingUsuariosChart' },
  { id: 'pieChart' },
  { id: 'categoriaChart' },
  { id: 'devolucaoChart' },
  { id: 'lineChart' },
  { id: 'stepChart' },
  { id: 'chartDiasSemana' },
  { id: 'renderHighchart' },
    { id: 'alunosLivrosEmprestimoChart' },

])

function renderHighchart(id, config) {
  Highcharts.chart(id, config)
}

// Função utilitária para cache
function cacheFetch(key, fetchFunction, expireInMs = 5 * 60 * 1000) {
  const cached = localStorage.getItem(key);
  const now = Date.now();

  if (cached) {
    const parsed = JSON.parse(cached);
    if (now - parsed.timestamp < expireInMs) {
      return Promise.resolve(parsed.data);
    }
  }

  return fetchFunction().then(data => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: now }));
    return data;
  });
}

onMounted(async () => {
  try {
    const rankingLivrosAno = await cacheFetch('rankingLivrosAno', () => window.api.getRankingLivrosAno());
    const emprestimosCategoria = await cacheFetch('emprestimosCategoria', () => window.api.getEmprestimosCategoria());
    const devolucoesPrazo = await cacheFetch('devolucoesPrazo', () => window.api.getDevolucoesPrazo());
    const evolucao = await cacheFetch('evolucaoEmprestimos', () => window.api.getEvolucaoEmprestimos());
    const diasSemana = await cacheFetch('diasSemanaMovimentados', () => window.api.getDiasSemanaMovimentados());
    const tempoMedio = await cacheFetch('tempoMedioUsuario', () => window.api.getTempoMedioUsuario());
    const percentuais = await cacheFetch('percentualUsuarios', () => window.api.getPercentualUsuarios());
    const rankingUser = await cacheFetch('rankingUsuariosEmprestimos', () => window.api.getRankingUsuariosEmprestimos());
    const totalUsuarios = await cacheFetch('totalUsuarios', () => window.api.getQuantidadeUsuarios());
    const totalLivros = await cacheFetch('totalLivros', () => window.api.getQuantidadeLivros());
    const totalEmprestimos = await cacheFetch('totalEmprestimos', () => window.api.getQuantidadeEmprestimos());



  
renderHighchart('alunosLivrosEmprestimoChart', {
  chart: { type: 'column' }, // <- alterado de 'line' para 'column'
  title: { text: 'Quantidade' },
  xAxis: {
    categories: ['Livros', 'Usuários', 'Empréstimos'],
    title: { text: 'Tipo' }
  },
  yAxis: {
    title: { text: 'Quantidade' },
    allowDecimals: false
  },
  series: [{
    name: 'Total',
  data: [
  totalLivros?.totalLivros ?? 0,
  totalUsuarios?.Usuarios ?? 0,
  totalEmprestimos?.Emprestimos ?? 0
],

    color: '#8E24AA'
  }],
  plotOptions: {
    column: {
      animation: { duration: 1500 },
      dataLabels: {
        enabled: true,
        format: '{point.y}'
      }
    },
    series: {
      marker: { enabled: true }
    }
  }
});

console.log('Dados do gráfico:', { totalLivros, totalUsuarios, totalEmprestimos });


    if (rankingLivrosAno?.length) {
      renderHighchart('rankingChart', {
        chart: { type: 'column' },
        title: { text: 'Ranking de Livros Mais Emprestados' },
        xAxis: { categories: rankingLivrosAno.map(i => i.titulo) },
        yAxis: { title: { text: 'Quantidade' } },
        series: [{
          name: 'Empréstimos',
          data: rankingLivrosAno.map(i => i.total_emprestimos),
          color: '#1976D2'
        }],
        plotOptions: { series: { animation: { duration: 1500 } } }
      })
    }

    if (emprestimosCategoria?.length) {
      renderHighchart('categoriaChart', {
        chart: { type: 'bar' },
        title: { text: 'Empréstimos por Gênero' },
        xAxis: { categories: emprestimosCategoria.map(i => i.categoria) },
        yAxis: { title: { text: 'Quantidade' } },
        series: [{
          name: 'Empréstimos',
          data: emprestimosCategoria.map(i => i.total),
          color: '#388E3C'
        }],
        plotOptions: { series: { animation: { duration: 1500 } } }
      })
    }

    if (devolucoesPrazo?.length) {
      const noPrazo = devolucoesPrazo.find(i => i.status === 'No Prazo')?.total || 0;
      const foraPrazo = devolucoesPrazo.find(i => i.status === 'Em Atraso')?.total || 0;
      renderHighchart('devolucaoChart', {
        chart: { type: 'column' },
        title: { text: 'Devoluções no Prazo vs Atrasadas' },
        xAxis: { categories: ['No Prazo', 'Não entregue ainda'] },
        yAxis: { title: { text: 'Quantidade' } },
        series: [{
          name: 'Devoluções',
          data: [noPrazo, foraPrazo],
          colorByPoint: true,
          colors: ['#0288D1', '#D32F2F']
        }],
        plotOptions: { series: { animation: { duration: 1500 } } }
      })
    }

    if (evolucao?.length) {
      renderHighchart('lineChart', {
        chart: { type: 'line' },
        title: { text: 'Evolução de Empréstimos' },
        xAxis: { categories: evolucao.map(i => i.periodo) },
        yAxis: { title: { text: 'Quantidade' } },
        series: [{
          name: 'Empréstimos',
          data: evolucao.map(i => i.total),
          color: '#00796B'
        }],
        plotOptions: { series: { animation: { duration: 1500 } } }
      })
    }

    if (tempoMedio?.length) {
      renderHighchart('stepChart', {
        chart: { type: 'line' },
        title: { text: 'Tempo Médio por Tipo de Usuário' },
        xAxis: { categories: tempoMedio.map(i => i.tipo_usuario) },
        yAxis: { title: { text: 'Dias' } },
        series: [{
          name: 'Tempo Médio (dias)',
          data: tempoMedio.map(i => i.media_dias),
          step: 'center',
          color: '#8E24AA'
        }],
        plotOptions: { series: { animation: { duration: 1500 } } }
      })
    }

    if (percentuais?.length) {
      const total = percentuais.reduce((sum, u) => sum + u.total, 0);
      renderHighchart('pieChart', {
        chart: { type: 'pie' },
        title: { text: 'Percentual por Tipo de Usuário' },
        series: [{
          name: 'Percentual',
          data: percentuais.map(i => ({
            name: i.tipo_usuario,
            y: parseFloat((i.total / total * 100).toFixed(2))
          })),
          colors: ['#1976D2', '#388E3C', '#FFA000', '#7B1FA2', '#0097A7']
        }],
        plotOptions: { pie: { animation: { duration: 1500 }, allowPointSelect: true, dataLabels: { enabled: true } } }
      })
    }

    if (diasSemana?.length) {
      const totais = [0, 0, 0, 0, 0, 0, 0]; // Segunda a Domingo

      diasSemana.forEach(item => {
        const dia = item.dia_num;
        const total = item.total;
        const indice = dia === '0' ? 6 : parseInt(dia) - 1;
        totais[indice] = total;
      });

      renderHighchart('chartDiasSemana', {
        chart: { type: 'column' },
        title: { text: 'Movimentações por Dia da Semana' },
        xAxis: { categories: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'] },
        yAxis: { title: { text: 'Movimentações' } },
        series: [{
          name: 'Empréstimos',
          data: totais,
          color: '#5C6BC0'
        }],
        plotOptions: { series: { animation: { duration: 1500 } } }
      });
    }

    if (rankingUser?.length) {
      renderHighchart('rankingUsuariosChart', {
        chart: { type: 'bar' },
        title: { text: 'Ranking de Usuários com Mais Empréstimos' },
        xAxis: {
          categories: rankingUser.map(i => i.nome),
          title: { text: 'Usuários' }
        },
        yAxis: {
          title: { text: 'Total de Empréstimos' }
        },
        series: [{
          name: 'Empréstimos',
          data: rankingUser.map(i => parseInt(i.totalEmprestimos)),
          color: '#F57C00'
        }],
        plotOptions: { series: { animation: { duration: 1500 } } }
      });
    }

  } catch (error) {
    console.error('Erro ao carregar os dados dos gráficos:', error);
  }
});
</script>
