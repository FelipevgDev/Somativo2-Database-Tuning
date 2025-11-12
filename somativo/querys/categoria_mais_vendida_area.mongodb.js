// Script: categoria_mais_vendida_area.mongodb.js
// Objetivo: Encontrar a categoria de produto mais vendida em uma área geográfica específica

use('Somativo');

print('\n========== CATEGORIA MAIS VENDIDA EM ÁREA GEOGRÁFICA ==========\n');

// PARÂMETROS CONFIGURÁVEIS
// Centro da busca (coordenadas em [longitude, latitude])
const centroBusca = [-46.6528, -23.5505]; // São Paulo - Av. Paulista

// Raio de busca em km (convertido para graus: 1 grau ≈ 111 km)
const raioKm = 5;
const raioGraus = raioKm / 111;

// Status de transações a considerar
const statusTransacoes = ["concluido", "em_entrega"];

print(`🔍 PARÂMETROS DE BUSCA:\n`);
print(`   Centro: [${centroBusca[0]}, ${centroBusca[1]}]`);
print(`   Raio: ${raioKm} km (${raioGraus.toFixed(6)} graus)`);
print(`   Status considerado: ${statusTransacoes.join(', ')}\n`);

// 1. Buscar todos os vendedores na área geográfica
print('1️⃣ Buscando vendedores na área...\n');

const vendedoresArea = db.usuarios.find({
  tipoUsuario: "Vendedor",
  "localizacao.coordinates": {
    $geoWithin: {
      $centerSphere: [centroBusca, raioGraus]
    }
  }
}).toArray();

print(`   ✅ ${vendedoresArea.length} vendedores encontrados\n`);

if (vendedoresArea.length === 0) {
  print('❌ Nenhum vendedor encontrado nesta área');
  quit();
}

// 2. Buscar produtos destes vendedores
print('2️⃣ Buscando produtos dos vendedores...\n');

const idsVendedores = vendedoresArea.map(v => v._id);
const produtosArea = db.produtos.find({
  idVendedor: { $in: idsVendedores }
}).toArray();

print(`   ✅ ${produtosArea.length} produtos encontrados\n`);

if (produtosArea.length === 0) {
  print('❌ Nenhum produto encontrado');
  quit();
}

// 3. Buscar transações concluídas destes produtos
print('3️⃣ Buscando transações concluídas...\n');

const idsProdutos = produtosArea.map(p => p._id);

// Agregação para contar vendas por categoria
const categoriasMaisVendidas = db.transacoes.aggregate([
  // Filtrar transações com status válido
  { $match: { status: { $in: statusTransacoes } } },
  
  // Expandir array de produtos
  { $unwind: "$produtos" },
  
  // Converter idProduto para ObjectId e filtrar
  {
    $addFields: {
      "produtos.idProdutoObj": { $toObjectId: "$produtos.idProduto" }
    }
  },
  
  // Filtrar apenas produtos da área
  { $match: { "produtos.idProdutoObj": { $in: idsProdutos } } },
  
  // Buscar dados do produto
  {
    $lookup: {
      from: "produtos",
      localField: "produtos.idProdutoObj",
      foreignField: "_id",
      as: "produto"
    }
  },
  { $unwind: "$produto" },
  
  // Agrupar por categoria
  {
    $group: {
      _id: "$produto.categoria.categoriaPrincipal",
      totalVendas: { $sum: "$produtos.quantidade" },
      totalReceita: {
        $sum: {
          $multiply: [
            "$produtos.quantidade",
            {
              $cond: [
                { $isNumber: "$produtos.precoCompra" },
                "$produtos.precoCompra",
                0
              ]
            }
          ]
        }
      },
      produtos: { $addToSet: "$produto.nome" },
      transacoes: { $sum: 1 }
    }
  },
  
  // Ordenar por total de vendas
  { $sort: { totalVendas: -1 } },
  
  // Buscar informações da categoria
  {
    $lookup: {
      from: "categorias",
      localField: "_id",
      foreignField: "_id",
      as: "categoria"
    }
  },
  { $unwind: { path: "$categoria", preserveNullAndEmptyArrays: true } },
  
  {
    $project: {
      _id: 0,
      categoriaNome: { $ifNull: ["$categoria.nome", "Categoria desconhecida"] },
      totalVendas: 1,
      totalReceita: 1,
      quantidadeProdutos: { $size: "$produtos" },
      totalTransacoes: "$transacoes",
      produtos: 1
    }
  }
]).toArray();

print(`   ✅ ${categoriasMaisVendidas.length} categorias encontradas\n`);

if (categoriasMaisVendidas.length === 0) {
  print('❌ Nenhuma transação encontrada');
  quit();
}

// 4. Exibir resultados
print('📊 CATEGORIAS MAIS VENDIDAS NA ÁREA\n');
print('Ranking de vendas:\n');

categoriasMaisVendidas.forEach((cat, idx) => {
  print(`${idx + 1}. ${cat.categoriaNome}`);
  print(`   Total de vendas: ${cat.totalVendas} unidades`);
  
  let receitaFormatada = 'N/A';
  if (cat.totalReceita) {
    const receita = parseFloat(cat.totalReceita.toString ? cat.totalReceita.toString() : cat.totalReceita);
    receitaFormatada = receita.toFixed(2);
  }
  print(`   Total de receita: R$ ${receitaFormatada}`);
  print(`   Quantidade de produtos: ${cat.quantidadeProdutos}`);
  print(`   Transações: ${cat.totalTransacoes}`);
  print(`   Produtos: ${cat.produtos.join(', ')}\n`);
});

// 5. Resumo
print('📈 RESUMO FINAL\n');
const primeiraCategoria = categoriasMaisVendidas[0];
print(`✅ Categoria mais vendida: ${primeiraCategoria.categoriaNome}`);
print(`   Vendas: ${primeiraCategoria.totalVendas} unidades`);

let receitaPrimeira = 'N/A';
if (primeiraCategoria.totalReceita) {
  const receita = parseFloat(primeiraCategoria.totalReceita.toString ? primeiraCategoria.totalReceita.toString() : primeiraCategoria.totalReceita);
  receitaPrimeira = receita.toFixed(2);
}
print(`   Receita: R$ ${receitaPrimeira}\n`);

print('========== FIM DO RELATÓRIO ==========\n');
