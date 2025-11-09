// Configuração do banco de dados
const database = 'Somativo';
use(database);

// Criar coleção com validação
db.createCollection("avaliacoes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["idUsuario", "idProduto", "idTransacao", "nota", "comentario", "dataAvaliacao"],
      properties: {
        idUsuario: { bsonType: "objectId" },
        idProduto: { bsonType: "objectId" },
        idTransacao: { bsonType: "objectId" },
        nota: { bsonType: "int", minimum: 1, maximum: 5 },
        comentario: { bsonType: "string" },
        respostaVendedor: {
          bsonType: "object",
          properties: {
            reposta: { bsonType: "string" },
            dataResposta: { bsonType: "date" }
          }
        },
        dataAvaliacao: { bsonType: "date" }
      }
    }
  }
});

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
    respostaVendedor: null,
    dataAvaliacao: new Date()
  }
]);