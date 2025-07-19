<template>
  <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    
    <!-- Navbar fixa no topo -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white p-4 flex items-center justify-between shadow-md">
      <div class="flex items-center space-x-3">
        <span class="text-xl font-semibold">Biblioteca</span>
      </div>

      <!-- Botão hambúrguer para abrir a sidebar no mobile -->
      <button @click="toggleSidebar" class="sm:hidden block text-white focus:outline-none text-2xl">
        ☰
      </button>
    </nav>

    <div class="flex flex-1 pt-16">
      
      <!-- Sidebar (esconde no mobile, aparece no sm+) -->
      <aside
        id="sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-full bg-gray-800 transition-transform transform sm:translate-x-0 -translate-x-full sm:static pt-16 sm:pt-4"
        :class="{ 'translate-x-0': sidebarOpen }"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-900 text-white">
          <div class="flex justify-center mb-6">
            <img src="../assets/logo.jpg" alt="Logo Sidebar" class="w-40 h-40 rounded-full" />
          </div>

          <ul class="space-y-2 font-medium">
            <li>
              <a href="#" @click.prevent="setComponent('Dashboard')" class="flex items-center p-2 rounded-lg hover:bg-gray-700 group">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
                </svg>
                <span class="ml-3">Home</span>
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="setComponent('Emprestimo')" class="flex items-center p-2 rounded-lg hover:bg-gray-700 group">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <span class="ml-3">Empréstimo</span>
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="setComponent('Livros')" class="flex items-center p-2 rounded-lg hover:bg-gray-700 group">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492z"/>
                </svg>
                <span class="ml-3">Livros</span>
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="setComponent('ControleUsuario')" class="flex items-center p-2 rounded-lg hover:bg-gray-700 group">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
                <span class="ml-3">Controle de Usuário</span>
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="setComponent('Lixeira')" class="flex items-center p-2 rounded-lg hover:bg-gray-700 group">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"/>
                </svg>
                <span class="ml-3">Lixeira</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Conteúdo principal -->
      <main :class="['flex-1 p-4 pt-24 transition-all duration-300', sidebarOpen ? 'sm:ml-64' : '']">
        <component :is="currentComponent" />
      </main>

    </div>
  </div>
</template>



<script>
import Emprestimo from './Emprestimo.vue';
import Livros from './Livro.vue';
import ControleUsuario from './ControleUsuario.vue';
import Dashboard from './Dashboard.vue';
import Lixeira from './Lixeira.vue';

export default {
  name: "Layout",
  components: {
    Livros,
    Emprestimo,
    ControleUsuario,
    Dashboard,
    Lixeira,
  },
  data() {
    return {
      currentComponent: null,
      sidebarOpen: false,
      darkMode: false,
    };
  },
  mounted() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      this.darkMode = true;
      document.documentElement.classList.add("dark");
    }

    const savedComponent = localStorage.getItem("component");
    if (savedComponent && this.$options.components[savedComponent]) {
      this.currentComponent = savedComponent;
    } else {
      this.currentComponent = 'Dashboard';
    }
  },
  methods: {
    setComponent(component) {
      this.currentComponent = component;
      localStorage.setItem("component", component);
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }
};
</script>

<style scoped>
#sidebar {
  transition: transform 0.3s ease-in-out;
  z-index: 30;
}
</style>
