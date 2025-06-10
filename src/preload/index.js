import { contextBridge, ipcRenderer,webUtils } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'


// Custom APIs for renderer
const api = {
  createLivro: (livro) => ipcRenderer.send('createLivro', livro),
  updateLivro: (livro) => ipcRenderer.send('updateLivro', livro),
  deleteLivro: (id) => ipcRenderer.send('deleteLivro', id),
  getLivro: () => ipcRenderer.invoke('getLivro'),

createLivrosEmMassa: (livros) => ipcRenderer.send('createLivrosEmMassa', livros),
  createEmprestimo: (emprestimo) => ipcRenderer.send('createEmprestimo', emprestimo),
  updateEmprestimo: (emprestimo) => ipcRenderer.send('updateEmprestimo', emprestimo),
  deleteEmprestimo: (id) => ipcRenderer.send('deleteEmprestimo', id),
  buscarEmprestimo: (id) => ipcRenderer.send('buscarEmprestimo', id),
  getEmprestimo: () => ipcRenderer.invoke('getEmprestimo'),

  createUser: (user) => ipcRenderer.send('createUser', user),
  updateUser: (user) => ipcRenderer.send('updateUser', user), 
  deleteUser: (id) => ipcRenderer.send('deleteUser', id),
  buscarUser: (id) => ipcRenderer.send('buscarUser', id),
  getUser: () => ipcRenderer.invoke('getUser'),

  getCategoria: () => ipcRenderer.invoke('getCategoria'),

  // Grafico

  salvarImagemBuffer: (buffer, nomeImagem) => ipcRenderer.invoke('salvarImagemBuffer', buffer, nomeImagem),



    getPathInput: (input) =>  webUtils.getPathForFile(input.files[0]),
  getQuantidadeEmprestimos: () => ipcRenderer.invoke('getQuantidadeEmprestimos'),
  getQuantidadeUsuarios: () => ipcRenderer.invoke('getQuantidadeUsuarios'),
  getQuantidadeLivros: () => ipcRenderer.invoke('getQuantidadeLivros'),
  getEvolucaoEmprestimos: () => ipcRenderer.invoke('getEvolucaoEmprestimos'),
  getEmprestimosCategoria: () => ipcRenderer.invoke('getEmprestimosCategoria'),
  getPercentualUsuarios: () => ipcRenderer.invoke('getPercentualUsuarios'),
  getDevolucoesPrazo: () => ipcRenderer.invoke('getDevolucoesPrazo'),
  getTempoMedioUsuario: () => ipcRenderer.invoke('getTempoMedioUsuario'),
  getLivrosPopulares: () => ipcRenderer.invoke('getLivrosPopulares'),
  getDiasSemanaMovimentados: () => ipcRenderer.invoke('getDiasSemanaMovimentados'),
  getRankingLivrosAno: () => ipcRenderer.invoke('getRankingLivrosAno'),
  getRankingUsuariosEmprestimos: () => ipcRenderer.invoke('getRankingUsuariosEmprestimos'),

}


// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
