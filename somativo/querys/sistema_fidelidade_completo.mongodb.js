// Script: sistema_fidelidade_completo.mongodb.js
// Objetivo: Implementar sistema de pontos de fidelidade com histórico, validações e conversão

use('Somativo');

print('\n========== SISTEMA DE FIDELIDADE - COMPLETO ==========\n');

// ==================== PARTE 1: ADICIONAR HISTÓRICO DE PONTOS ====================
print('1️⃣ ATUALIZANDO SCHEMA DE USUÁRIOS COM HISTÓRICO DE PONTOS\n');

// Atualizar todos os usuários para incluir historioPontos se não tiverem
const usuariosParaAtualizar = db.usuarios.find({ historioPontos: { $exists: false } }).toArray();

if (usuariosParaAtualizar.length > 0) {
  usuariosParaAtualizar.forEach(usuario => {
    db.usuarios.updateOne(
      { _id: usuario._id },
      {
        $set: {
          historioPontos: [],
          ultimaAtualizacaoPontos: new Date()
        }
      }
    );
  });
  print(`✅ ${usuariosParaAtualizar.length} usuários atualizados com historioPontos\n`);
} else {
  print('✅ Todos os usuários já possuem historioPontos\n');
}

// ==================== PARTE 2: CONSTANTES E CONFIGURAÇÕES ====================
print('2️⃣ CONFIGURAÇÕES DO SISTEMA DE FIDELIDADE\n');

const CONFIGURACOES = {
  TAXA_PONTOS: 0.1,              // 1 ponto a cada R$ 10 (0.1 ponto por real)
  MINIMO_PONTOS_USO: 100,         // Mínimo de 100 pontos para usar
  VALIDADE_DIAS: 180,             // Pontos expiram em 180 dias
  VALOR_PONTO_REAIS: 0.05,        // 1 ponto = R$ 0.05 em desconto
  TIPOS_TRANSACAO: {
    COMPRA: 'compra',
    FIDELIDADE: 'fidelidade',
    CANCELAMENTO: 'cancelamento',
    EXPIRAÇÃO: 'expiração'
  }
};

print(`Taxa de pontos: R$ ${(1/CONFIGURACOES.TAXA_PONTOS).toFixed(2)} = 1 ponto`);
print(`Mínimo para usar: ${CONFIGURACOES.MINIMO_PONTOS_USO} pontos`);
print(`Validade: ${CONFIGURACOES.VALIDADE_DIAS} dias`);
print(`Valor do ponto: R$ ${CONFIGURACOES.VALOR_PONTO_REAIS.toFixed(2)}\n`);

// ==================== PARTE 3: FUNÇÃO - CALCULAR PONTOS ====================
print('3️⃣ FUNÇÃO: CALCULAR PONTOS POR COMPRA\n');

function calcularPontos(valorCompra) {
  return Math.floor(valorCompra * CONFIGURACOES.TAXA_PONTOS);
}

// Teste
const testePontos = calcularPontos(5000);
print(`Teste: Compra de R$ 5000,00 = ${testePontos} pontos\n`);

// ==================== PARTE 4: FUNÇÃO - ADICIONAR PONTOS AO HISTÓRICO ====================
print('4️⃣ FUNÇÃO: ADICIONAR PONTOS COM HISTÓRICO\n');

function adicionarPontosComHistorico(idUsuario, pontos, tipoTransacao, idTransacao) {
  return db.usuarios.updateOne(
    { _id: ObjectId(idUsuario) },
    {
      $inc: { pontosFidelidade: pontos },
      $push: {
        historioPontos: {
          data: new Date(),
          pontos: pontos,
          tipo: tipoTransacao,
          idTransacao: idTransacao || null,
          saldoAnterior: 0, // Será atualizado na próxima operação
          saldoAtual: 0     // Será atualizado na próxima operação
        }
      },
      $set: { ultimaAtualizacaoPontos: new Date() }
    }
  );
}

print('✅ Função registrada\n');

// ==================== PARTE 5: LISTAR HISTÓRICO DE PONTOS ====================
print('5️⃣ QUERY: VER HISTÓRICO DE PONTOS DE UM USUÁRIO\n');

const nomeUsuarioParaBuscar = "Rafael Mendes";
const usuarioComHistorico = db.usuarios.findOne(
  { nome: nomeUsuarioParaBuscar },
  { 
    nome: 1, 
    pontosFidelidade: 1, 
    historioPontos: 1,
    ultimaAtualizacaoPontos: 1
  }
);

if (usuarioComHistorico) {
  print(`📊 HISTÓRICO DE PONTOS - ${nomeUsuarioParaBuscar}`);
  print(`   Saldo atual: ${usuarioComHistorico.pontosFidelidade} pontos`);
  print(`   Última atualização: ${usuarioComHistorico.ultimaAtualizacaoPontos}\n`);
  
  print('   Movimentações:\n');
  if (usuarioComHistorico.historioPontos && usuarioComHistorico.historioPontos.length > 0) {
    usuarioComHistorico.historioPontos.slice(-10).forEach((mov, idx) => {
      const sinal = mov.pontos > 0 ? '✅ +' : '❌ ';
      print(`   ${idx + 1}. ${sinal}${Math.abs(mov.pontos)} pontos - ${mov.tipo}`);
      print(`      Data: ${mov.data}`);
      if (mov.idTransacao) print(`      Transação: ${mov.idTransacao}`);
      print('');
    });
  } else {
    print('   (Sem movimentações registradas)\n');
  }
}

// ==================== PARTE 6: CONVERTER PONTOS EM DESCONTO ====================
print('\n6️⃣ QUERY: CONVERTER PONTOS EM DESCONTO\n');

function converterPontosEmDesconto(pontos) {
  if (pontos < CONFIGURACOES.MINIMO_PONTOS_USO) {
    return {
      valido: false,
      mensagem: `Mínimo de ${CONFIGURACOES.MINIMO_PONTOS_USO} pontos necessários. Você tem ${pontos}.`
    };
  }
  
  const desconto = pontos * CONFIGURACOES.VALOR_PONTO_REAIS;
  return {
    valido: true,
    pontosUsados: pontos,
    descontoEmReais: parseFloat(desconto.toFixed(2)),
    mensagem: `${pontos} pontos = R$ ${desconto.toFixed(2)} de desconto`
  };
}

// Teste
const testeConversao = converterPontosEmDesconto(200);
print(`Teste: 200 pontos → ${testeConversao.mensagem}\n`);

// ==================== PARTE 7: USAR PONTOS EM COMPRA ====================
print('7️⃣ QUERY: USAR PONTOS EM UMA COMPRA\n');

function usarPontosNaCompra(idUsuario, pontos, idTransacao) {
  // 1. Verificar se usuário tem pontos suficientes
  const usuario = db.usuarios.findOne({ _id: ObjectId(idUsuario) });
  
  if (!usuario) {
    return { sucesso: false, erro: 'Usuário não encontrado' };
  }
  
  if (usuario.pontosFidelidade < pontos) {
    return { 
      sucesso: false, 
      erro: `Pontos insuficientes. Disponível: ${usuario.pontosFidelidade}, Solicitado: ${pontos}` 
    };
  }
  
  if (pontos < CONFIGURACOES.MINIMO_PONTOS_USO) {
    return { 
      sucesso: false, 
      erro: `Mínimo de ${CONFIGURACOES.MINIMO_PONTOS_USO} pontos para usar desconto` 
    };
  }
  
  // 2. Deduzir pontos
  const resultado = db.usuarios.updateOne(
    { _id: ObjectId(idUsuario) },
    {
      $inc: { pontosFidelidade: -pontos },
      $push: {
        historioPontos: {
          data: new Date(),
          pontos: -pontos,
          tipo: 'fidelidade_usada',
          idTransacao: idTransacao,
          desconto: pontos * CONFIGURACOES.VALOR_PONTO_REAIS
        }
      }
    }
  );
  
  const desconto = pontos * CONFIGURACOES.VALOR_PONTO_REAIS;
  
  return {
    sucesso: true,
    pontosUsados: pontos,
    descontoAplicado: parseFloat(desconto.toFixed(2)),
    novoSaldo: usuario.pontosFidelidade - pontos,
    mensagem: `✅ ${pontos} pontos usados = R$ ${desconto.toFixed(2)} de desconto`
  };
}

// Teste
print('Teste de uso de pontos (exemplo simulado):\n');
const testeUso = usarPontosNaCompra('6913c7346dfda9d20bcad953', 100, 'TEST-001');
if (testeUso.sucesso) {
  print(`✅ ${testeUso.mensagem}`);
  print(`   Novo saldo: ${testeUso.novoSaldo} pontos\n`);
} else {
  print(`❌ ${testeUso.erro}\n`);
}

// ==================== PARTE 8: LIMPAR PONTOS EXPIRADOS ====================
print('8️⃣ QUERY: EXPIRAR PONTOS ANTIGOS\n');

function expirarPontosAntigos() {
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - CONFIGURACOES.VALIDADE_DIAS);
  
  // Buscar usuários com pontos antigos
  const usuariosComPontosAntigos = db.usuarios.find({
    historioPontos: {
      $elemMatch: {
        data: { $lt: dataLimite },
        tipo: 'compra',
        expirado: { $ne: true }
      }
    }
  }).toArray();
  
  print(`Usuários com pontos para expirar: ${usuariosComPontosAntigos.length}\n`);
  
  let totalPontosExpirados = 0;
  
  usuariosComPontosAntigos.forEach(usuario => {
    const pontosExpiradosEsteUsuario = usuario.historioPontos
      .filter(mov => mov.data < dataLimite && mov.tipo === 'compra' && !mov.expirado)
      .reduce((sum, mov) => sum + (mov.pontos || 0), 0);
    
    if (pontosExpiradosEsteUsuario > 0) {
      db.usuarios.updateOne(
        { _id: usuario._id },
        {
          $inc: { pontosFidelidade: -pontosExpiradosEsteUsuario },
          $push: {
            historioPontos: {
              data: new Date(),
              pontos: -pontosExpiradosEsteUsuario,
              tipo: 'expiração',
              motivo: `Pontos expirados após ${CONFIGURACOES.VALIDADE_DIAS} dias`
            }
          }
        }
      );
      
      print(`✅ ${usuario.nome}: ${pontosExpiradosEsteUsuario} pontos expirados`);
      totalPontosExpirados += pontosExpiradosEsteUsuario;
    }
  });
  
  return {
    usuariosAfetados: usuariosComPontosAntigos.length,
    pontosExpirados: totalPontosExpirados
  };
}

// ==================== PARTE 9: RELATÓRIO DE FIDELIDADE ====================
print('\n9️⃣ QUERY: RELATÓRIO DE FIDELIDADE POR USUÁRIO\n');

const relatorioFidelidade = db.usuarios.aggregate([
  { $match: { tipoUsuario: "Comprador" } },
  {
    $project: {
      nome: 1,
      email: 1,
      pontosFidelidade: 1,
      historioPontos: 1,
      totalHistorico: { $size: "$historioPontos" },
      ultimaCompra: {
        $max: {
          $filter: {
            input: "$historioPontos",
            as: "item",
            cond: { $eq: ["$$item.tipo", "compra"] }
          }
        }
      }
    }
  },
  { $sort: { pontosFidelidade: -1 } }
]).toArray();

print('📊 RELATÓRIO DE FIDELIDADE - TOP 5 CLIENTES\n');
relatorioFidelidade.slice(0, 5).forEach((usuario, idx) => {
  print(`${idx + 1}. ${usuario.nome}`);
  print(`   Email: ${usuario.email}`);
  print(`   Pontos: ${usuario.pontosFidelidade}`);
  print(`   Movimentações: ${usuario.totalHistorico}`);
  print('');
});

// ==================== PARTE 10: TOP COMPRADORES ====================
print('🏆 TOP COMPRADORES POR PONTOS GANHOS\n');

const topCompradores = db.usuarios.aggregate([
  { $match: { tipoUsuario: "Comprador", pontosFidelidade: { $gt: 0 } } },
  {
    $project: {
      nome: 1,
      pontosFidelidade: 1,
      equivalemReais: { $multiply: ["$pontosFidelidade", CONFIGURACOES.VALOR_PONTO_REAIS] }
    }
  },
  { $sort: { pontosFidelidade: -1 } },
  { $limit: 3 }
]).toArray();

topCompradores.forEach((usuario, idx) => {
  print(`${idx + 1}. ${usuario.nome}`);
  print(`   ${usuario.pontosFidelidade} pontos (≈ R$ ${usuario.equivalemReais.toFixed(2)} em desconto)`);
});

print('\n========== FIM DO SISTEMA DE FIDELIDADE ==========\n');
