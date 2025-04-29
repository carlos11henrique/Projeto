import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'


// Custom APIs for renderer
const api = {
  createLivro: (livro) => ipcRenderer.send('createLivro', livro),
  updateLivro: (livro) => ipcRenderer.send('updateLivro', livro),
  deleteLivro: (id) => ipcRenderer.send('deleteLivro', id),
  getLivro: () => ipcRenderer.invoke('getLivro'),


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



  // Grafico


  getEvolucaoEmprestimos: () => ipcRenderer.invoke('grafico-evolucao-emprestimos'),
  getEmprestimosCategoria: () => ipcRenderer.invoke('grafico-emprestimos-categoria'),
  getPercentualUsuarios: () => ipcRenderer.invoke('grafico-percentual-tipo-usuario'),
  getDevolucoesPrazo: () => ipcRenderer.invoke('grafico-devolucoes-prazo'),
  getTempoMedioUsuario: () => ipcRenderer.invoke('grafico-media-tempo-usuario'),
  getLivrosPopulares: () => ipcRenderer.invoke('grafico-livros-mais-emprestados'),
  getDiasSemanaMovimentados: () => ipcRenderer.invoke('grafico-dias-semana'),
  getRankingLivrosAno: () => ipcRenderer.invoke('grafico-ranking-livros-ano'),

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
