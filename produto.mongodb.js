use("megadatadog");

// db.produtos.deleteMany({}); // deletando todos os docs antes de inserir os novos

db.produtos.insertMany([
  {
    nome: "Teclado Mecânico RGB",
    descricao: "Teclado gamer com switches azuis e iluminação RGB completa",
    preco: 350.00,
    quantidadeDisponivel: 15,
    localGeo: {
      type: "Point",
      coordinates: [-46.6333, -23.5505]
    },
    categoria: {
      nome: "Periféricos",
      subcategoria: "Teclados"
    },
    promocaoAtiva: {
      ativo: true,
      descontoPercentual: 10,
      dataInicio: ISODate("2025-11-01T00:00:00Z"),
      dataFim: ISODate("2025-11-15T00:00:00Z")
    }
  },
  {
    nome: "Mouse Gamer 7200 DPI",
    descricao: "Mouse óptico ergonômico com sensor de alta precisão",
    preco: 180.00,
    quantidadeDisponivel: 30,
    localGeo: {
      type: "Point",
      coordinates: [-43.2096, -22.9035]
    },
    categoria: {
      nome: "Periféricos",
      subcategoria: "Mouses"
    },
    promocaoAtiva: {
      ativo: false
    }
  },
  {
    nome: "Monitor 27'' 144Hz",
    descricao: "Monitor gamer com resolução Full HD e taxa de atualização de 144Hz",
    preco: 1200.00,
    quantidadeDisponivel: 8,
    localGeo: {
      type: "Point",
      coordinates: [-51.2177, -30.0346]
    },
    categoria: {
      nome: "Monitores",
      subcategoria: "Gamer"
    },
    promocaoAtiva: {
      ativo: true,
      descontoPercentual: 5,
      dataInicio: ISODate("2025-11-03T00:00:00Z"),
      dataFim: ISODate("2025-11-10T00:00:00Z")
    }
  },
  {
    nome: "Cadeira Gamer Confort Max",
    descricao: "Cadeira ergonômica reclinável com apoio para os pés",
    preco: 950.00,
    quantidadeDisponivel: 12,
    localGeo: {
      type: "Point",
      coordinates: [-38.5108, -12.9714]
    },
    categoria: {
      nome: "Móveis",
      subcategoria: "Cadeiras"
    },
    promocaoAtiva: {
      ativo: false
    }
  },
  {
    nome: "Headset Surround 7.1",
    descricao: "Fone de ouvido gamer com som surround e microfone retrátil",
    preco: 420.00,
    quantidadeDisponivel: 20,
    localGeo: {
      type: "Point",
      coordinates: [-48.5480, -27.5954]
    },
    categoria: {
      nome: "Áudio",
      subcategoria: "Headsets"
    },
    promocaoAtiva: {
      ativo: true,
      descontoPercentual: 15,
      dataInicio: ISODate("2025-11-04T00:00:00Z"),
      dataFim: ISODate("2025-11-18T00:00:00Z")
    }
  }
]);

// Verificação de inserção
db.produtos.find().pretty();
