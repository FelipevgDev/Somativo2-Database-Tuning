// Buscar avaliações de um produto por nome (compatível com schema)
use('Somativo');

const nomeProduto = "Tablet XYZ";
print('\n=== Buscando avaliações para: ' + nomeProduto + ' ===\n');

const produtos = db.produtos.find({ nome: nomeProduto }).toArray();
if (!produtos.length) {
  print('❌ Produto não encontrado: ' + nomeProduto);
} else {
  print('✅ Produto encontrado. Buscando avaliações...\n');
  const idsProdutos = produtos.map(p => p._id);
  
  const avaliacoes = db.avaliacoes.aggregate([
    { $match: { idProduto: { $in: idsProdutos } } },
    { $lookup: {
        from: "usuarios",
        localField: "idUsuario",
        foreignField: "_id",
        as: "usuario"
    }},
    { $unwind: "$usuario" },
    { $project: {
        _id: 0,
        nota: 1,
        comentario: 1,
        dataAvaliacao: 1,
        usuarioNome: "$usuario.nome",
        usuarioEmail: "$usuario.email",
        respostaVendedor: 1
    }}
  ]).toArray();
  
  if (avaliacoes.length === 0) {
    print('ℹ️  Nenhuma avaliação encontrada para este produto.');
  } else {
    print('Total de avaliações: ' + avaliacoes.length + '\n');
    avaliacoes.forEach((av, idx) => {
      print((idx + 1) + '. ' + av.usuarioNome + ' (' + av.nota + ' ⭐)');
      print('   Comentário: ' + av.comentario);
      print('   Data: ' + av.dataAvaliacao);
      if (av.respostaVendedor) {
        print('   Resposta: ' + av.respostaVendedor.resposta);
      }
      print('');
    });
  }
}