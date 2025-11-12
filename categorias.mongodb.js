
const database = 'Somativo';
use(database);


db.createCollection("categorias", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "nivel"],
      properties: {
        nome: {
          bsonType: "string",
          description: "Nome da categoria"
        },
        nivel: {
          bsonType: "int",
          minimum: 0,
          maximum: 1,
          description: "0 = categoria principal, 1 = subcategoria"
        },
        descricao: {
          bsonType: ["string", "null"],
          description: "Descrição opcional da categoria"
        },
        categoriaPai: {
          bsonType: ["objectId", "null"],
          description: "Referência para categoria principal, se for subcategoria"
        }
      }
    }
  }
});

db.categorias.insertMany([
  {
    nome: "Eletrônicos",
    nivel: 0,
    descricao: "Produtos eletrônicos em geral",
    categoriaPai: null
  },
  {
    nome: "Smartphones",
    nivel: 1,
    descricao: "Celulares e smartphones modernos",
    categoriaPai: db.categorias.findOne({ nome: "Eletrônicos" })?._id || null
  },
  {
    nome: "Notebooks",
    nivel: 1,
    descricao: "Laptops e notebooks portáteis",
    categoriaPai: db.categorias.findOne({ nome: "Eletrônicos" })?._id || null
  },
  {
    nome: "Acessórios",
    nivel: 0,
    descricao: "Acessórios diversos para eletrônicos e vestuário",
    categoriaPai: null
  },
  {
    nome: "Chaveiro",
    nivel: 1,
    descricao: "Acessórios pequenos e personalizados",
    categoriaPai: db.categorias.findOne({ nome: "Acessórios" })?._id || null
  },
  {
    nome: "Livros",
    nivel: 0,
    descricao: "Categoria de livros em geral",
    categoriaPai: null
  },
  {
    nome: "Romance",
    nivel: 1,
    descricao: "Livros de romance e ficção",
    categoriaPai: db.categorias.findOne({ nome: "Livros" })?._id || null
  },
  {
    nome: "Aventura",
    nivel: 1,
    descricao: "Livros de aventura e ação",
    categoriaPai: db.categorias.findOne({ nome: "Livros" })?._id || null
  },
  {
    nome: "Roupas",
    nivel: 0,
    descricao: "Categoria de roupas em geral",
    categoriaPai: null
  },
  {
    nome: "Camisetas",
    nivel: 1,
    descricao: "Roupas do tipo camiseta",
    categoriaPai: db.categorias.findOne({ nome: "Roupas" })?._id || null
  },
   {
    nome: "Papelaria",
    nivel: 0,
    descricao: "Artigos de papelaria diversos",
    categoriaPai: null
  },
  {
    nome: "Cadernos",
    nivel: 1,
    descricao: "Cadernos de diversos tamanhos e estilos",
    categoriaPai: db.categorias.findOne({ nome: "Papelaria" })?._id || null
  },
  {
    nome: "Canetas",
    nivel: 0,
    descricao: "Categoria de canetas em geral",
    categoriaPai: db.categorias.findOne({ nome: "Papelaria" })?._id || null
  },
  {
    nome: "Lapiseiras",
    nivel: 0,
    descricao: "Categoria de lapiseiras em geral",
    categoriaPai: db.categorias.findOne({ nome: "Papelaria" })?._id || null
  },
    {
    nome: "Moveis",
    nivel: 0,
    descricao: "Móveis diversos para eletrônicos e vestuário",
    categoriaPai: null
  },
  {
    nome: "Cadeiras",
    nivel: 1,
    descricao: "Móveis pequenos e personalizados",
    categoriaPai: db.categorias.findOne({ nome: "Moveis" })?._id || null
  },
  {
    nome: "Armarios",
    nivel: 0,
    descricao: "Categoria de armários em geral",
    categoriaPai: null
  },
  
]);


// Índices para otimizar consultas
db.categorias.createIndex({ nome: 1 }, { unique: true });
db.categorias.createIndex({ categoriaPai: 1 });
