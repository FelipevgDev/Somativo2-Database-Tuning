// Configuração do banco de dados
const database = 'Somativo';
use(database);

// Criar coleção com validação
db.createCollection("produtos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "descricao", "preco", "quantidade", "idVendedor", "localizacao", "categoria"],
      properties: {
        nome: { bsonType: "string" },
        descricao: { bsonType: "string" },
        preco: { bsonType: ["decimal", "double"] },
        quantidade: { bsonType: "int", minimum: 0 },
        idVendedor: { bsonType: "objectId" },
        localizacao: {
          bsonType: "object",
          required: ["tipo", "coordenadas"],
          properties: {
            tipo: { enum: ["Point"] },
            coordenadas: {
              bsonType: "array",
              minItems: 2,
              maxItems: 2,
              items: { bsonType: "number" }
            }
          }
        },
        categoria: {
          bsonType: "object",
          required: ["categoriaPrincipal"],
          properties: {
            categoriaPrincipal: { bsonType: "objectId" },
            categoriaSecundaria: { bsonType: "objectId" }
          }
        },
        promocoes: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["percentualDesconto", "dataInicio", "dataFim", "ativo"],
            properties: {
              percentualDesconto: { bsonType: "int" },
              dataInicio: { bsonType: "date" },
              dataFim: { bsonType: "date" },
              ativo: { bsonType: "bool" }
            }
          }
        }
      }
    }
  }
});

// Inserir exemplos

db.produtos.insertMany([
  {
    nome: "Smartphone XYZ",
    descricao: "Smartphone último modelo com 128GB",
    preco: NumberDecimal("2499.99"),
    quantidade: 10,
    idVendedor: db.usuarios.findOne({ tipoUsuario: "Vendedor" })._id,
    localizacao: {
      tipo: "Point",
      coordenadas: [-46.6528, -23.5505]
    },
    categoria: {
      categoriaPrincipal: ObjectId('6910be737273a6caeb938630'),
      categoriaSecundaria: ObjectId('6910be737273a6caeb938631')
    },
    promocoes: [{
      percentualDesconto: 10,
      dataInicio: new Date("2025-11-01"),
      dataFim: new Date("2025-12-01"),
      ativo: true
    }]
  },
  {
    nome: "Notebook ABC",
    descricao: "Notebook com processador de última geração",
    preco: NumberDecimal("4999.99"),
    quantidade: 5,
    idVendedor: db.usuarios.findOne({ tipoUsuario: "Vendedor" })._id,
    localizacao: {
      tipo: "Point",
      coordenadas: [-46.6528, -23.5505]
    },
    categoria: {
      categoriaPrincipal: ObjectId('6910be737273a6caeb938630'),
      categoriaSecundaria: ObjectId('6910be737273a6caeb938632')
    },
    promocoes: []
  }
]);