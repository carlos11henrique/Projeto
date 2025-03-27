<template>
  <div class="flex flex-col h-screen">
    <!-- Navbar -->
    <nav class="bg-gray-800 text-white p-4 flex items-center justify-between">
      <div class="flex items-center">
        <span class="text-lg font-semibold ml-2">Nome do Sistema</span>
      </div>
    </nav>

    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside
        id="default-sidebar"
        class="fixed top-16 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul class="space-y-2 font-medium">
            <li>
              <a
                href="#"
                @click.prevent="setComponent('Dashboard')"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
                </svg>
                <span class="ms-3">Home</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                @click.prevent="setComponent('Emprestimo')"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Empréstimo</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                @click.prevent="setComponent('Livros')"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book" viewBox="0 0 16 16">
  <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
</svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Livros</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                @click.prevent="setComponent('ControleUsuario')"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
</svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Controle de Usuário</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="p-4 sm:ml-64 flex-1 mt-16">
        <RouterView v-if="selectedComponent === null" />
        <Livros v-if="selectedComponent === 'Livros'" />
        <Emprestimo v-if="selectedComponent === 'Emprestimo'" />
        <ControleUsuarioVue v-if="selectedComponent === 'ControleUsuario'" />
        <Dashboard v-if="selectedComponent === 'Dashboard'" />
      </main>
    </div>
  </div>
</template>

<script>
import Emprestimo from './Emprestimo.vue';
import Livros from './Livro.vue';
import ControleUsuarioVue from './ControleUsuario.vue';
import Dashboard from './Dashboard.vue';

export default {
  name: "Layout",
  components: {
    Livros, 
    Emprestimo,
    ControleUsuarioVue,
    Dashboard
  },
  data() {
    return {
      selectedComponent: null,
    };
  },
  methods: {
    setComponent(component) {
      this.selectedComponent = component;
    },
  },
};
</script>
