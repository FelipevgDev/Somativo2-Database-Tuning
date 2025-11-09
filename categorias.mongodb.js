// Configuração do banco de dados
const database = 'Somativo';
use(database);

// Criar coleção com validação
db.createCollection("categorias", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "nivel"],
      properties: {
        nome: { bsonType: "string" },
        nivel: { bsonType: "int", minimum: 0 }
      }
    }
  }
});

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
    nivel: 0
  },
  {
    nome: "Chaveiro",
    nivel: 1
  }
]);