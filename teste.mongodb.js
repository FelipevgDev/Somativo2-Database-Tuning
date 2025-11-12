const database = 'Somativo';
use(database);


db.produtos.insertMany([
  // --- MÓVEIS ---
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

