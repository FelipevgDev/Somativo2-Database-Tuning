const database = 'Somativo';
use(database);

//db.produtos.drop();

db.createCollection("produtos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "descricao", "preco", "quantidade", "idVendedor", "localizacao", "categoria"],
      properties: {
        nome: { bsonType: "string" },
        descricao: { bsonType: "string" },
        preco: { bsonType: ["decimal", "double"], minimum: 0 },
        quantidade: { bsonType: "int", minimum: 0 },
        idVendedor: { bsonType: "objectId" },
        localizacao: {
          bsonType: "object",
          required: ["type", "coordinates"],
          properties: {
            type: { enum: ["Point"] },
            coordinates: {
              bsonType: "array",
              items: { bsonType: "double" },
              minItems: 2,
              maxItems: 2
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
              percentualDesconto: { bsonType: "int", minimum: 0, maximum: 100 },
              dataInicio: { bsonType: "date" },
              dataFim: { bsonType: "date" },
              ativo: { bsonType: "bool" }
            }
          }
        },
        mediaAvaliacoes: { bsonType: ["double", "null"] }
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
    localizacao: { type: "Point", coordinates: [-46.6528, -23.5505] },
    categoria: {
      categoriaPrincipal: ObjectId("6910be737273a6caeb938630"),
      categoriaSecundaria: ObjectId("6910be737273a6caeb938631")
    },
    promocoes: [
      {
        percentualDesconto: 10,
        dataInicio: new Date("2025-11-01"),
        dataFim: new Date("2025-12-01"),
        ativo: true
      }
    ],
    mediaAvaliacoes: 4.5
  },
  {
    nome: "Notebook ABC",
    descricao: "Notebook com processador de última geração",
    preco: NumberDecimal("4999.99"),
    quantidade: 5,
    idVendedor: db.usuarios.findOne({ tipoUsuario: "Vendedor" })._id,
    localizacao: { type: "Point", coordinates: [-46.640, -23.552] },
    categoria: {
      categoriaPrincipal: ObjectId("6910be737273a6caeb938630"),
      categoriaSecundaria: ObjectId("6910be737273a6caeb938632")
    },
    promocoes: [],
    mediaAvaliacoes: null
  }
]);

// Índices de produtos
db.produtos.createIndex({ localizacao: "2dsphere" });
db.produtos.createIndex({ "categoria.categoriaPrincipal": 1 });
db.produtos.createIndex({ idVendedor: 1 });