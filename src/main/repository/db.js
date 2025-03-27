const { type } = require('jquery');
const Sequelize = require('sequelize');

// Crie a conexão com o banco de dados
const sequelize = new Sequelize('banco', 'usuario', 'senha', {
  host: 'localhost',
  dialect: 'mysql'
});

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false
  },
  matricula: {
    type : DataTypes.STRING,
    allowNull: false

  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  tipo: {
    type: DataTypes.ENUM('Aluno', 'Professor', 'Adm'),
    allowNull: false
  },
  serie: {
    type: DataTypes.STRING,
    allowNull: true, // Este campo é opcional para 'Professor' e 'Adm'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,  
  tableName: 'Usuarios',  // Nome da tabela no banco de dados
});
class Livro extends Sequelize.Model {}
Livro.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: Sequelize.STRING
  },
  autor: {
    type: Sequelize.STRING
  },
  codigoLivro: {
    type: Sequelize.STRING
  },
  editora: {
    type: Sequelize.STRING
  },
  genero: {
    type: Sequelize.STRING
  },
descricao: {
  type: Sequelize.STRING

},
  imagem: {
    type: Sequelize.STRING
  }
},
 {
  sequelize,
  modelName: 'livro'
});


class Emprestimo extends Sequelize.Model {}
Emprestimo.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  livroId: {
    type: Sequelize.INTEGER,
    references: {
      model: Livro,
      key: 'id'
    }
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  dataEmprestimo: {
    type: Sequelize.DATE
  },
  dataDevolucao: {
    type: Sequelize.DATE
  },
  status: {
    type: Sequelize.STRING
  }
}, {
  sequelize,
  modelName: 'emprestimo'
});
sequelize.sync();

const usuario = await Usuario.create({
  nome: 'João',
  email: 'joao@example.com',
  tipo: 'adm'
});