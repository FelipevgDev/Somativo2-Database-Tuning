// Configuração do banco de dados
const database = 'Somativo';
use(database);

// Criar coleção
db.createCollection("produtos");

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
      categoriaPrincipal: ObjectId()
    },
    promocoes: [{
      percentualDesconto: 10,
      dataInicio: new Date("2025-11-01"),
      dataFim: new Date("2025-12-01"),
      ativo: true
    }],
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
      categoriaPrincipal: ObjectId()
    },
  }
]);