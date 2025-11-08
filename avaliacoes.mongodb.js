// Configuração do banco de dados
const database = 'Somativo';
use(database);

// Criar coleção
db.createCollection("avaliacoes");

// Inserir exemplos

db.avaliacoes.insertMany([
  {
    idUsuario: db.usuarios.findOne()._id,
    idProduto: db.produtos.findOne()._id,
    idTransacao: db.transacoes.findOne()._id,
    nota: 5,
    comentario: "Excelente produto, chegou antes do prazo!",
    respostaVendedor: {
      reposta: "Obrigado pela avaliação! Ficamos felizes em atender suas expectativas.",
      dataResposta: new Date()
    },
    dataAvaliacao: new Date()
  },
  {
    idUsuario: db.usuarios.findOne()._id,
    idProduto: db.produtos.findOne()._id,
    idTransacao: db.transacoes.findOne()._id,
    nota: 4,
    comentario: "Produto bom, mas a entrega demorou um pouco.",
    dataAvaliacao: new Date()
  }
]);