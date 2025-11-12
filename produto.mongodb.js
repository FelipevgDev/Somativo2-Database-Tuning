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
  },
  {
    nome: "Livro: Orgulho e Preconceito",
    descricao: "Clássico romance de Jane Austen, edição de luxo.",
    preco: NumberDecimal("89.90"),
    quantidade: 20,
    idVendedor: db.usuarios.findOne({ tipoUsuario: "Vendedor" })._id,
    localizacao: { type: "Point", coordinates: [-46.635, -23.550] },
    categoria: {
      categoriaPrincipal: ObjectId("6914f71419e2e74f5b6bc0c3"), // Livros
      categoriaSecundaria: ObjectId("6914f71419e2e74f5b6bc0c4")  // Romance
    },
    promocoes: [
      {
        percentualDesconto: 15,
        dataInicio: new Date("2025-11-10"),
        dataFim: new Date("2025-12-10"),
        ativo: true
      }
    ],
    mediaAvaliacoes: 4.8
  },
  {
    nome: "Livro: As Aventuras de Sherlock Holmes",
    descricao: "Coletânea dos melhores contos de Arthur Conan Doyle.",
    preco: NumberDecimal("79.90"),
    quantidade: 30,
    idVendedor: db.usuarios.findOne({ tipoUsuario: "Vendedor" })._id,
    localizacao: { type: "Point", coordinates: [-46.637, -23.551] },
    categoria: {
      categoriaPrincipal: ObjectId("6914f71419e2e74f5b6bc0c3"), // Livros
      categoriaSecundaria: ObjectId("6914f71419e2e74f5b6bc0c5")  // Aventura
    },
    promocoes: [],
    mediaAvaliacoes: 4.6
  },
  {
    nome: "Camiseta Básica Algodão",
    descricao: "Camiseta confortável 100% algodão.",
    preco: NumberDecimal("59.90"),
    quantidade: 50,
    idVendedor: db.usuarios.findOne({ tipoUsuario: "Vendedor" })._id,
    localizacao: { type: "Point", coordinates: [-46.640, -23.552] },
    categoria: {
      categoriaPrincipal: ObjectId("6914f71419e2e74f5b6bc0c6"), // Roupas
      categoriaSecundaria: ObjectId("6914f71419e2e74f5b6bc0c7")  // Camisetas
    },
    promocoes: [
      {
        percentualDesconto: 10,
        dataInicio: new Date("2025-11-05"),
        dataFim: new Date("2025-11-25"),
        ativo: true
      }
    ],
    mediaAvaliacoes: 4.4
  },
  {
    nome: "Camiseta Estampada Geek",
    descricao: "Camiseta temática com estampas de cultura pop.",
    preco: NumberDecimal("79.90"),
    quantidade: 25,
    idVendedor: db.usuarios.findOne({ tipoUsuario: "Vendedor" })._id,
    localizacao: { type: "Point", coordinates: [-46.642, -23.553] },
    categoria: {
      categoriaPrincipal: ObjectId("6914f71419e2e74f5b6bc0c6"), // Roupas
      categoriaSecundaria: ObjectId("6914f71419e2e74f5b6bc0c7")  // Camisetas
    },
    promocoes: [],
    mediaAvaliacoes: 4.7
  },
  {
    nome: "Jaqueta Jeans Clássica",
    descricao: "Jaqueta jeans unissex com acabamento reforçado.",
    preco: NumberDecimal("199.90"),
    quantidade: 15,
    idVendedor: db.usuarios.findOne({ tipoUsuario: "Vendedor" })._id,
    localizacao: { type: "Point", coordinates: [-46.648, -23.555] },
    categoria: {
      categoriaPrincipal: ObjectId("6914f71419e2e74f5b6bc0c6"), // Roupas
      categoriaSecundaria: null
    },
    promocoes: [],
    mediaAvaliacoes: 4.5
  },
  {
    nome: "Cadeira Ergonômica OfficePro",
    descricao: "Cadeira ergonômica com regulagem de altura e apoio lombar.",
    preco: NumberDecimal("899.90"),
    quantidade: 25,
    idVendedor: db.usuarios.findOne({ tipoUsuario: "Vendedor" })._id,
    localizacao: { type: "Point", coordinates: [-46.635, -23.550] },
    categoria: {
      categoriaPrincipal: ObjectId("6914fb146d160a7aad50ba99"), // Moveis
      categoriaSecundaria: ObjectId("6914fb146d160a7aad50ba9a") // Cadeiras
    },
    promocoes: [
      {
        percentualDesconto: 10,
        dataInicio: new Date("2025-11-15"),
        dataFim: new Date("2025-12-15"),
        ativo: true
      }
    ],
    mediaAvaliacoes: 4.7
  },
  {
    nome: "Armário Multiuso Compact",
    descricao: "Armário de madeira MDF com três portas e duas prateleiras internas.",
    preco: NumberDecimal("1299.00"),
    quantidade: 12,
    idVendedor: db.usuarios.findOne({ tipoUsuario: "Vendedor" })._id,
    localizacao: { type: "Point", coordinates: [-46.637, -23.551] },
    categoria: {
      categoriaPrincipal: ObjectId("6914fb146d160a7aad50ba9b"), // Armarios
      categoriaSecundaria: null
    },
    promocoes: [],
    mediaAvaliacoes: 4.5
  },
  {
    nome: "Mesa de Escritório SmartDesk",
    descricao: "Mesa com estrutura metálica e tampo em MDF de alta durabilidade.",
    preco: NumberDecimal("749.90"),
    quantidade: 20,
    idVendedor: db.usuarios.findOne({ tipoUsuario: "Vendedor" })._id,
    localizacao: { type: "Point", coordinates: [-46.640, -23.553] },
    categoria: {
      categoriaPrincipal: ObjectId("6914fb146d160a7aad50ba99"), // Moveis
      categoriaSecundaria: null
    },
    promocoes: [
      {
        percentualDesconto: 5,
        dataInicio: new Date("2025-11-20"),
        dataFim: new Date("2025-12-05"),
        ativo: true
      }
    ],
    mediaAvaliacoes: 4.3
  },

  // --- PAPELARIA ---
  {
    nome: "Caderno Universitário 200 folhas",
    descricao: "Caderno espiralado com capa dura e divisórias coloridas.",
    preco: NumberDecimal("29.90"),
    quantidade: 100,
    idVendedor: db.usuarios.findOne({ tipoUsuario: "Vendedor" })._id,
    localizacao: { type: "Point", coordinates: [-46.642, -23.552] },
    categoria: {
      categoriaPrincipal: ObjectId("6914fbc4a890e8d634574adf"), // Papelaria
      categoriaSecundaria: ObjectId("6914fbc4a890e8d634574ae0") // Cadernos
    },
    promocoes: [
      {
        percentualDesconto: 15,
        dataInicio: new Date("2025-11-01"),
        dataFim: new Date("2025-11-30"),
        ativo: true
      }
    ],
    mediaAvaliacoes: 4.8
  },
  {
    nome: "Caneta Esferográfica Azul Premium",
    descricao: "Caneta com corpo em metal e tinta de secagem rápida.",
    preco: NumberDecimal("9.90"),
    quantidade: 200,
    idVendedor: db.usuarios.findOne({ tipoUsuario: "Vendedor" })._id,
    localizacao: { type: "Point", coordinates: [-46.645, -23.554] },
    categoria: {
      categoriaPrincipal: ObjectId("6914fbc4a890e8d634574adf"), // Papelaria
      categoriaSecundaria: ObjectId("6914fbc4a890e8d634574ae1") // Canetas
    },
    promocoes: [],
    mediaAvaliacoes: 4.6
  },
  {
    nome: "Lapiseira 0.7mm GripLine",
    descricao: "Lapiseira com corpo emborrachado e design ergonômico.",
    preco: NumberDecimal("12.90"),
    quantidade: 150,
    idVendedor: db.usuarios.findOne({ tipoUsuario: "Vendedor" })._id,
    localizacao: { type: "Point", coordinates: [-46.648, -23.555] },
    categoria: {
      categoriaPrincipal: ObjectId("6914fbc4a890e8d634574adf"), // Papelaria
      categoriaSecundaria: ObjectId("6914fbc4a890e8d634574ae2") // Lapiseiras
    },
    promocoes: [
      {
        percentualDesconto: 10,
        dataInicio: new Date("2025-11-05"),
        dataFim: new Date("2025-11-25"),
        ativo: true
      }
    ],
    mediaAvaliacoes: 4.4
  }
]);

// Índices de produtos
db.produtos.createIndex({ localizacao: "2dsphere" });
db.produtos.createIndex({ "categoria.categoriaPrincipal": 1 });
db.produtos.createIndex({ idVendedor: 1 });