
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
  }
]);

// Índices para otimizar consultas
db.categorias.createIndex({ nome: 1 }, { unique: true });
db.categorias.createIndex({ categoriaPai: 1 });
