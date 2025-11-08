// Configuração do banco de dados
const database = 'Somativo';
use(database);

// Criar coleção
db.createCollection("categorias");

// Inserir exemplos
db.categorias.insertMany([
  {
    nome: "Eletrônicos",
    nivel: 0
  },
  {
    nome: "Smartphones",
    nivel: 1
  },
  {
    nome: "Notebooks",
    nivel: 1
  },
  {
    nome: "Acessórios",
    nivel: 1
  },
  {
    nome: "Capas e Cases",
    nivel: 2
  }
]);