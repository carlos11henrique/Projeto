import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { event } from 'jquery'
import {EmprestimoModel,sequelize} from './models'
import {UserModel} from './models'
import { LivroModel } from './models'
import { CategoriaModel } from './models'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '..','preload','index.js'),
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

  
  // Evolução dos Empréstimos por Mês
  ipcMain.handle('getEvolucaoEmprestimos', async () => {
    return  sequelize.query(`
        SELECT strftime('%y-%m', 'dataEmprestimo') AS periodo, COUNT(*) AS total
        FROM Loans
        GROUP BY periodo
        ORDER BY periodo;
      `)
  })


  // Empréstimos por Categoria
  ipcMain.handle('getEmprestimosCategoria', async () => {
    return new Promise((resolve, reject) => {
      sequelize.query(`
        SELECT Categories.nome AS categoria, COUNT(*) AS total
        FROM Loans
        JOIN Books ON Loans.BookId = Books.id
        JOIN Categories ON Books.CategoryId = Categories.id
        GROUP BY Categories.nome
        ORDER BY total DESC;
      `, (err, rows) => {
        if (err) {
          console.error('Erro na consulta:', err);
          reject(err);
        } else {
          console.log('Dados obtidos:', rows);
          resolve(rows);
        }
      });
    });
  });
  

  // Percentual de Empréstimos por Tipo de Usuário
  ipcMain.handle('getPercentualUsuarios', async () => {
    return new Promise((resolve, reject) => {
      sequelize.query(`
         SELECT Users.tipo AS tipo_usuario, COUNT(*) AS total
    FROM Loans
    JOIN Users ON Loans.UserId = Users.id
    GROUP BY Users.tipo;
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });

  // Devoluções no Prazo vs. Atrasadas
  ipcMain.handle('getDevolucoesPrazo', async () => {
    return new Promise((resolve, reject) => {
      sequelize.query(`
      SELECT 
  CASE 
    WHEN dataDevolucao <= DATE(dataEmprestimo, '+7 days') THEN 'No Prazo'
    ELSE 'Em Atraso'
  END AS status,
  COUNT(*) AS total
FROM Loans
WHERE dataDevolucao IS NOT NULL
GROUP BY status;

      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });

  // Tempo Médio de Empréstimo por Tipo de Usuário
  ipcMain.handle('getTempoMedioUsuario', async () => {
    return new Promise((resolve, reject) => {
      sequelize.query(`
        SELECT Users.tipo AS tipo_usuario,
       AVG(JULIANDAY(dataDevolucao) - JULIANDAY(dataEmprestimo)) AS media_dias
FROM Loans
JOIN Users ON Loans.userId = Users.id
WHERE dataDevolucao IS NOT NULL
GROUP BY Users.tipo;

      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });

  // Livros Mais Populares
  ipcMain.handle('getLivrosPopulares', async () => {
    return new Promise((resolve, reject) => {
      sequelize.query(`
       SELECT Books.titulo, COUNT(*) AS total
FROM Loans
JOIN Books ON Loans.bookId = Books.id
GROUP BY Books.id
ORDER BY total DESC
LIMIT 5;

      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });

  // Dias da Semana com Mais Empréstimos
  ipcMain.handle('getDiasSemanaMovimentados', async () => {
    return new Promise((resolve, reject) => {
      sequelize.query(`
    SELECT 
  strftime('%w', dataEmprestimo) AS dia_semana,
  COUNT(*) AS total
FROM Loans
GROUP BY dia_semana
ORDER BY dia_semana;

      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });

  // Ranking de Livros por Ano
  ipcMain.handle('getRankingLivrosAno', async () => {
    return new Promise((resolve, reject) => {
      sequelize.query(`
        SELECT 
  Books.titulo,
  strftime('%Y', Loans.dataEmprestimo) AS ano,
  COUNT(*) AS total_emprestimos
FROM Loans
JOIN Books ON Loans.BookId = Books.id
GROUP BY Books.titulo, ano
ORDER BY total_emprestimos DESC
LIMIT 10;

      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });


  
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
  ipcMain.on('createEmprestimo', async (event, loans) => {
    try {
      await EmprestimoModel.create(loans);
      console.log('Empréstimo cadastrado com sucesso');
    } catch (error) {
      handleError(event, error, 'createEmprestimo');
    }
  });



  // Repetir padrão para Emprestimo
  ipcMain.on('updateEmprestimo', async (event, data) => {
    try {
      console.log('Dados recebidos para update:', data);
  
      if (!data.id) {
        throw new Error('ID do empréstimo não fornecido.');
      }
  
      const emprestimo = await EmprestimoModel.findByPk(data.id);
  
      if (!emprestimo) {
        throw new Error('Empréstimo não encontrado.');
      }
  
      await emprestimo.update({
        dataEmprestimo: data.dataEmprestimo,
        dataDevolucao: data.dataDevolucao,
        status: data.status,
        BookId: data.bookId, // atenção: deve ser 'BookId' se for o nome da foreign key
        UserId: data.userId
      });
  
      event.reply('updateEmprestimoResponse', { sucesso: true });
    } catch (error) {
      console.error('Erro em updateEmprestimo:', error);
    }
  });
  
  
  // 📌 Deletar empréstimo
  ipcMain.on('deleteEmprestimo', async (event, id) => {
    try {
      await Emprestimo.destroy({ where: { id } });
      console.log('Emprestimo deletado com sucesso');
    } catch (error) {
      handleError(event, error, 'deleteEmprestimo');
    }
  });
  
  
  // 📌 Buscar empréstimo por ID
  ipcMain.on('buscarEmprestimo', async (event, id) => {
    try {
      const emprestimo = await Emprestimo.findByPk(id, {
        include: [Livro, User]
      });
      event.reply('emprestimo', emprestimo);
    } catch (error) {
      handleError(event, error, 'buscarEmprestimo');
    }
  });
  
  
  // 📌 Buscar todos os empréstimos
  ipcMain.handle('getEmprestimo', async () => {
    try {
      const emprestimos = await EmprestimoModel.findAll({
        include: [
          { model: LivroModel, as: 'Book' },
          { model: UserModel, as: 'User' }
        ]
      });
  
      console.log(emprestimos);
  
      return emprestimos.map(e => e.toJSON());
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
  
ipcMain.handle('getCategoria', async () => {
  try {
    const Category = await CategoriaModel.findAll();
    return Category.map(c => c.dataValues);
  } catch (error) {
    console.error('Erro em getCategorias:', error);
    throw error;
  }})
  
  createWindow()
});


app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.on?.('unhandledRejection', (reason, promise) => {
  console.error('❌ Promessa rejeitada não tratada:', reason);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
