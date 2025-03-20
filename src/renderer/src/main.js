import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import Layout from './components/Layout.vue' 
import Dashboard from './components/Dashboard.vue'
import ControleUsuario from './components/ControleUsuario.vue'
import Emprestimo from './components/Emprestimo.vue'
import Livro from './components/Livro.vue'

const routes = [
    {
        path: '/', component: Layout, children: [
            { path: "", component: Dashboard },
            { path: 'ControleUsuario', component: ControleUsuario },
            { path: 'Emprestimo', component: Emprestimo },
            { path: 'Livro', component: Livro }

        ]
    },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

createApp(App).use(router).mount('#app')
