// Buscar avaliações de um produto por nome (compatível com schema)
const database = 'Somativo';
use(database);
const nomeProduto = "Smartphone XYZ";
const produtos = db.produtos.find({ nome: nomeProduto }).toArray();
if (!produtos.length) {
  "Produto não encontrado: " + nomeProduto;
} else {
  const idsProdutos = produtos.map(p => p._id);
  db.avaliacoes.aggregate([
    { $match: { idProduto: { $in: idsProdutos } } },
    { $lookup: {
        from: "usuarios",
        localField: "idUsuario",
        foreignField: "_id",
        as: "usuario"
    }},
    { $unwind: "$usuario" },
    { $project: {
        nota: 1,
        comentario: 1,
        dataAvaliacao: 1,
        "usuario._id": 1,
        "usuario.nome": 1,
        respostaVendedor: 1
    }}
  ]).toArray();
}