<template>
    <form>
      <div class="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div class="w-full">
          <label for="first_name" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">Nome do Livro</label>
          <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
        </div>
        
        <div class="w-full">
          <label for="last_name" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">Autor do Livro</label>
          <input type="text" id="last_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required />
        </div>
        
        <div class="w-full">
          <label for="company" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">Editora</label>
          <input type="text" id="company" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Flowbite" required />
        </div>  
        
        <div class="w-full">
          <label for="visitors" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">Gênero</label>
          <input type="text" id="visitors" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required />
        </div>
  
        <div class="w-full">
          <label for="description" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">Descrição</label>
          <input type="text" id="description" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required />
        </div>
        
        <div class="w-full">
          <label for="website" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">Código do Livro</label>
          <input type="text" id="website" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="flowbite.com" required />
        </div>
  
        <div class="w-full">
          <label for="quantity" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">Quantidade de Livros</label>
          <input type="number" id="quantity" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required />
        </div>
      </div>
  
      <div class="w-full">
        <label class="block mb-2 text-base font-medium text-gray-900 dark:text-white" for="file_input">Selecione uma imagem SVG, PNG ou JPG (MAX. 800x400px)</label>
        <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file">
      </div>
  
      <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cadastra</button>
    </form>
  </template>
  
  <script>
  export default {
    name: "Livro",
  }
  </script>
  