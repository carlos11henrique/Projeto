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
])

function renderHighchart(id, config) {
  Highcharts.chart(id, config)
}

onMounted(async () => {
  try {
    const rankingLivrosAno = await window.api.getRankingLivrosAno();
    const emprestimosCategoria = await window.api.getEmprestimosCategoria();
    const devolucoesPrazo = await window.api.getDevolucoesPrazo();
    const evolucao = await window.api.getEvolucaoEmprestimos();
    const diasSemana = await window.api.getDiasSemanaMovimentados();
    const tempoMedio = await window.api.getTempoMedioUsuario();
    const percentuais = await window.api.getPercentualUsuarios();
    const rankingUser = await window.api.getRankingUsuariosEmprestimos();

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
        title: { text: 'Empréstimos por Categoria' },
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
        xAxis: { categories: ['No Prazo', 'Não entrege ainda'] },
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

    const totais = [0, 0, 0, 0, 0, 0, 0];
    diasSemana.forEach(item => {
      const idx = parseInt(item.dia_semana);
      if (idx >= 0 && idx <= 6) totais[idx] = item.total;
    });

    if (diasSemana?.length) {
      const totais = [0, 0, 0, 0, 0, 0, 0]; // Segunda a Domingo

      diasSemana.forEach(item => {
        const dia = item.dia_num;   // '0' a '6'
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
