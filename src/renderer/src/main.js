import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import HighchartsVue from 'highcharts-vue';

import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import Layout from './components/Layout.vue' 
import Chart from 'primevue/chart'
import { name } from 'faker-br/lib/locales/az';

const routes = [
    {
        path: '/',
        component: Layout,
        





        children: [
           { path: '', component: () => import('./components/Dashboard.vue') },
            { path: 'ControleUsuario', component: () => import('./components/ControleUsuario.vue') },
            { path: 'Emprestimo', component: () => import('./components/Emprestimo.vue') },
           { path: 'Livro', component: () => import('./components/Livro.vue') },
           { path: 'Lixeira', component: () => import('./components/Lixeira.vue') },
         ],

    },
]

const router = createRouter({
    history: createWebHashHistory(), // Usando createWebHistory
    routes,
})

const app = createApp(App)

app.use(HighchartsVue)
app.use(router)

app.component('Chart', Chart)
app.mount('#app')
