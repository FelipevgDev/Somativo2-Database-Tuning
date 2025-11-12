// Script: media_distancia_simples.mongodb.js
// Objetivo: Calcular média de distância - versão simplificada e robusta

use('Somativo');

print('\n========== MÉDIA DE DISTÂNCIA: COMPRADORES x VENDEDORES ==========\n');

// 1. Buscar todas as transações concluídas
const transacoes = db.transacoes.find({ status: "concluido" }).toArray();

print(`Total de transações concluídas: ${transacoes.length}\n`);

if (transacoes.length === 0) {
  print('❌ Nenhuma transação concluída encontrada');
  quit();
}

// 2. Processar cada transação manualmente
const distancias = [];

transacoes.forEach((transacao, idx) => {
  print(`Processando transação ${idx + 1}...`);
  
  // Buscar comprador
  const comprador = db.usuarios.findOne({ _id: ObjectId(transacao.idUsuario) });
  if (!comprador || !comprador.localizacao || !comprador.localizacao.coordinates) {
    print(`  ⚠️ Comprador inválido`);
    return;
  }
  
  // Processar cada produto da transação
  transacao.produtos.forEach((prod, pidx) => {
    // Buscar produto
    const produto = db.produtos.findOne({ _id: ObjectId(prod.idProduto) });
    if (!produto) {
      print(`  ⚠️ Produto ${prod.idProduto} não encontrado`);
      return;
    }
    
    // Buscar vendedor
    const vendedor = db.usuarios.findOne({ _id: ObjectId(produto.idVendedor) });
    if (!vendedor || !vendedor.localizacao || !vendedor.localizacao.coordinates) {
      print(`  ⚠️ Vendedor inválido`);
      return;
    }
    
    // Calcular distância
    const [lonComprador, latComprador] = comprador.localizacao.coordinates;
    const [lonVendedor, latVendedor] = vendedor.localizacao.coordinates;
    
    const diffLon = lonVendedor - lonComprador;
    const diffLat = latVendedor - latComprador;
    const distGraus = Math.sqrt(diffLon * diffLon + diffLat * diffLat);
    const distKm = distGraus * 111; // 1 grau ≈ 111 km
    
    distancias.push({
      idTransacao: transacao.idTransacao,
      dataCompra: transacao.dataCompra,
      compradorNome: comprador.nome,
      compradorCidade: comprador.endereco?.cidade || 'N/A',
      vendedorNome: vendedor.nome,
      vendedorCidade: vendedor.endereco?.cidade || 'N/A',
      produtoNome: produto.nome,
      distanciaKm: distKm
    });
  });
});

print(`\n✅ ${distancias.length} distâncias calculadas\n`);

if (distancias.length === 0) {
  print('❌ Nenhuma distância pôde ser calculada');
  quit();
}

// 3. Calcular estatísticas
const media = distancias.reduce((sum, d) => sum + d.distanciaKm, 0) / distancias.length;
const menor = Math.min(...distancias.map(d => d.distanciaKm));
const maior = Math.max(...distancias.map(d => d.distanciaKm));

// 4. Exibir estatísticas
print('📊 ESTATÍSTICAS DE DISTÂNCIA\n');
print(`   Média de distância: ${media.toFixed(2)} km`);
print(`   Menor distância: ${menor.toFixed(2)} km`);
print(`   Maior distância: ${maior.toFixed(2)} km`);
print(`   Total de transações: ${distancias.length}\n`);

// 5. Exibir detalhes das transações
print('📋 DETALHES DAS TRANSAÇÕES\n');
distancias.sort((a, b) => a.distanciaKm - b.distanciaKm).forEach((d, idx) => {
  print(`${idx + 1}. Transação ${d.idTransacao}`);
  print(`   Data: ${d.dataCompra}`);
  print(`   Comprador: ${d.compradorNome} (${d.compradorCidade})`);
  print(`   Vendedor: ${d.vendedorNome} (${d.vendedorCidade})`);
  print(`   Produto: ${d.produtoNome}`);
  print(`   Distância: ${d.distanciaKm.toFixed(2)} km\n`);
});

print('========== FIM DO RELATÓRIO ==========\n');
