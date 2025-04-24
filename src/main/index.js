import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { event } from 'jquery'
import {EmprestimoModel} from './models'
import {UserModel} from './models'
import { LivroModel } from './models'
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  const handleError = (event, error, context = '') => {
    console.error(`Erro em ${context}:`, error);
    if (event?.reply) {
      event.reply('erro', { context, message: error.message });
    }
  };
  
  ipcMain.on('createLivro', async (event, book) => {
    try {
      await LivroModel.create(book);
      console.log('Livro cadastrado com sucesso');
    } catch (error) {
      handleError(event, error, 'createLivro');
    }
  });
  
  ipcMain.on('updateLivro', async (event, book) => {
    try {
      await LivroModel.update(book, { where: { id: book.id } });
      console.log('Livro atualizado com sucesso');
    } catch (error) {
      handleError(event, error, 'updateLivro');
    }
  });
  
  ipcMain.on('deleteLivro', async (event, id) => {
    try {
      await LivroModel.destroy({ where: { id: id } });
      console.log('Livro deletado com sucesso');
    } catch (error) {
      handleError(event, error, 'deleteLivro');
    }
  });
  
  ipcMain.on('buscarLivro', async (event, id) => {
    try {
      const livro = await LivroModel.findByPk(id);
      event.reply('livro', livro);
    } catch (error) {
      handleError(event, error, 'buscarLivro');
    }
  });
  
  ipcMain.handle('getLivro', async () => {
    try {
      const livros = await LivroModel.findAll();
      return livros.map(l => l.dataValues);
    } catch (error) {
      console.error('Erro em getLivro:', error);
      throw error;
    }
  });
  
  // Repetir padrão para Emprestimo
  ipcMain.on('createEmprestimo', async (event, emprestimo) => {
    try {
      await EmprestimoModel.create(emprestimo);
      console.log('Emprestimo cadastrado com sucesso');
    } catch (error) {
      handleError(event, error, 'createEmprestimo');
    }
  });
  
  ipcMain.on('updateEmprestimo', async (event, data) => {
    try {
      await EmprestimoModel.update({
        dataEmprestimo: data.dataEmprestimo,
        dataDevolucao: data.dataDevolucao,
        status: data.status,
        LivroId: data.LivroId,
        UsuarioId: data.UsuarioId
      }, {
        where: { id: data.id }
      });
  
      event.reply('updateEmprestimoResponse', { sucesso: true });
    } catch (error) {
      console.error('Erro em updateEmprestimo:', error);
      event.reply('updateEmprestimoResponse', { sucesso: false, erro: error.message });
    }
  });
  
  
  
  ipcMain.on('deleteEmprestimo', async (event, id) => {
    try {
      await EmprestimoModel.destroy({ where: { id: id } });
      console.log('Emprestimo deletado com sucesso');
    } catch (error) {
      handleError(event, error, 'deleteEmprestimo');
    }
  });
  
  ipcMain.on('buscarEmprestimo', async (event, id) => {
    try {
      const emprestimo = await EmprestimoModel.findByPk(id);
      event.reply('emprestimo', emprestimo);
    } catch (error) {
      handleError(event, error, 'buscarEmprestimo');
    }
  });
  
  ipcMain.handle('getEmprestimo', async () => {
    try {
      const emprestimos = await EmprestimoModel.findAll();
      return emprestimos.map(e => e.dataValues);
    } catch (error) {
      console.error('Erro em getEmprestimo:', error);
      throw error;
    }
  });
  
  // Repetir padrão para User
  ipcMain.on('createUser', async (event, user) => {
    try {
      await UserModel.create(user);
      console.log('User cadastrado com sucesso');
    } catch (error) {
      handleError(event, error, 'createUser');
    }
  });
  
  ipcMain.on('updateUser', async (event, user) => {
    try {
      await UserModel.update(user, { where: { id: user.id } });
      console.log('User atualizado com sucesso');
    } catch (error) {
      handleError(event, error, 'updateUser');
    }
  });
  
  ipcMain.on('deleteUser', async (event, id) => {
    try {
      await UserModel.destroy({ where: { id: id } });
      console.log('User deletado com sucesso');
    } catch (error) {
      handleError(event, error, 'deleteUser');
    }
  });
  
  ipcMain.on('buscarUser', async (event, id) => {
    try {
      const user = await UserModel.findByPk(id);
      event.reply('user', user);
    } catch (error) {
      handleError(event, error, 'buscarUser');
    }
  });
  
  ipcMain.handle('getUser', async () => {
    try {
      const users = await UserModel.findAll();
      return users.map(u => u.dataValues);
    } catch (error) {
      console.error('Erro em getUser:', error);
      throw error;
    }
  });
  

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
