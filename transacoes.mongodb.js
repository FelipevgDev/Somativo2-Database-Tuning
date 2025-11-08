// Configuração do banco de dados
const database = 'Somativo';
use(database);

// Criar coleção
db.createCollection("transacoes");

// Inserir exemplos
db.transacoes.insertMany([
  {
    idUsuario: db.usuarios.findOne()._id,
    produtos: [{
      idProduto: db.produtos.findOne()._id,
      quantidade: 1,
      precoCompra: NumberDecimal("2499.99"),
    }],
    valorTotal: NumberDecimal("2250.00"),
    pontosFidelidadeGanhos: 225,
    metodo: "credito",
    idTransacao: "TRX" + new Date().getTime(),
    entrega: {
      endereco: {
        rua: "Rua das Flores",
        numero: "123",
        complemento: "Apto 101",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567"
      }
    },
    dataCompra: new Date()
  }
]);