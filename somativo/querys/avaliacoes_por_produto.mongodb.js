// Banco de dados
use('Somativo');

// ===== Buscar todas as avaliações de um produto (por id) =====
// Substitua pelo ObjectId real do produto
const produtoId = ObjectId("6910b6df017f6604890c1b09");

// Consulta simples: todas as avaliações do produto
db.avaliacoes.find({ idProduto: produtoId }).sort({ dataAvaliacao: -1 }).pretty();

// ===== Agregação: trazer também dados do usuário autor da avaliação =====
db.avaliacoes.aggregate([
  { $match: { idProduto: produtoId } },
  { $lookup: {
      from: "usuarios",
      localField: "idUsuario",
      foreignField: "_id",
      as: "usuario"
  }},
  { $unwind: { path: "$usuario", preserveNullAndEmptyArrays: true } },
  { $project: {
      nota: 1,
      comentario: 1,
      dataAvaliacao: 1,
      "usuario._id": 1,
      "usuario.nome": 1,
      respostaVendedor: 1
  }}
]).pretty();

// Observações:
// - Substitua "REPLACE_WITH_ID_PRODUTO" pelo ObjectId correto da collection `produtos`.
// - A agregação acima mostra o nome do usuário (quando disponível) junto com a avaliação.
// - Para executar: abra este arquivo no MongoDB Playground do VS Code e rode o script.