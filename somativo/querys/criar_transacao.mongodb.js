// Banco de dados
use('Somativo');

/**
 * Fluxo de Compra (versão compatível com MongoDB Playground - sem async/await)
 * Motivos do erro anterior:
 *  - Playground não executa funções async/await como em Node.js.
 *  - Operações com Decimal128 exigem conversão para Number para cálculos.
 *  - IDs podem não existir: melhor buscar dinamicamente por nome/email.
 *  - Desconto não deve armazenar Number puro quando campo usa Decimal.
 */

// ===== Parâmetros da simulação =====
const nomeProduto = "Smartphone XYZ";        // Nome do produto a comprar
const emailComprador = "joao@email.com";     // Email do comprador
const quantidadeCompra = 2;                  // Quantidade desejada
const metodoPagamento = "credito";          // Método de pagamento

// 1. Buscar produto
const produto = db.produtos.findOne({ nome: nomeProduto });
if (!produto) {
    print("Produto não encontrado pelo nome:", nomeProduto);
    quit();
}

// 2. Verificar estoque
if (typeof produto.quantidade !== 'number' || produto.quantidade < quantidadeCompra) {
    print("Estoque insuficiente. Disponível:", produto.quantidade, "Solicitado:", quantidadeCompra);
    quit();
}

// 3. Buscar comprador
const comprador = db.usuarios.findOne({ email: emailComprador });
if (!comprador) {
    print("Usuário não encontrado pelo email:", emailComprador);
    quit();
}

// 4. Calcular valores (convertendo Decimal128 para Number)
let precoUnitario = parseFloat(produto.preco.toString());
if (isNaN(precoUnitario)) {
    print("Preço inválido no produto:", produto.preco);
    quit();
}

let desconto = 0;
const agora = new Date();
if (Array.isArray(produto.promocoes) && produto.promocoes.length > 0) {
    const promocaoAtiva = produto.promocoes.find(p => p.ativo && p.dataInicio <= agora && p.dataFim >= agora);
    if (promocaoAtiva) {
        desconto = (precoUnitario * (promocaoAtiva.percentualDesconto / 100)) * quantidadeCompra;
    }
}

const subtotal = precoUnitario * quantidadeCompra;
const total = subtotal - desconto;
const pontosGanhos = Math.floor(total / 10); // regra: 1 ponto a cada R$10

// 5. Montar documento da transação (agora com entrega/endereco obrigatório)
const transacaoDoc = {
    idUsuario: comprador._id,
    produtos: [{
        idProduto: produto._id,
        quantidade: quantidadeCompra,
        precoCompra: produto.preco, // mantemos como Decimal128
        desconto: desconto > 0 ? { tipo: "promocao", valor: NumberDecimal(desconto.toFixed(2)) } : null
    }],
    valorTotal: NumberDecimal(total.toFixed(2)),
    pontosFidelidadeGanhos: pontosGanhos,
    metodo: metodoPagamento,
    idTransacao: "TRX" + Date.now(),
    entrega: {
        endereco: {
            rua: comprador.endereco.rua,
            numero: comprador.endereco.numero,
            complemento: comprador.endereco.complemento || "",
            cidade: comprador.endereco.cidade,
            estado: comprador.endereco.estado,
            cep: comprador.endereco.cep
        }
    },
    dataCompra: new Date()
};

// 6. Inserir transação
const insertResult = db.transacoes.insertOne(transacaoDoc);
if (!insertResult.acknowledged) {
    print("Falha ao inserir transação");
    quit();
}

// 7. Atualizar estoque
const estoqueResult = db.produtos.updateOne({ _id: produto._id }, { $inc: { quantidade: -quantidadeCompra } });
if (estoqueResult.modifiedCount !== 1) {
    print("Falha ao atualizar estoque, removendo transação criada (rollback manual)");
    db.transacoes.deleteOne({ _id: insertResult.insertedId });
    quit();
}

// 8. Atualizar pontos de fidelidade do usuário
db.usuarios.updateOne({ _id: comprador._id }, { $inc: { pontosFidelidade: pontosGanhos } });

// 9. Saída de sucesso
print("================ RESULTADO DA COMPRA ================");
print("Transação criada:", insertResult.insertedId);
print("Produto:", nomeProduto);
print("Quantidade:", quantidadeCompra);
print("Subtotal:", subtotal.toFixed(2));
print("Desconto aplicado:", desconto.toFixed(2));
print("Total:", total.toFixed(2));
print("Pontos ganhos:", pontosGanhos);

// 10. Exibir registros atualizados
print("\nProduto após atualização de estoque:");
printjson(db.produtos.findOne({ _id: produto._id }, { nome: 1, quantidade: 1 }));

print("\nÚltima transação do usuário:");

print("\nPontos de fidelidade do usuário:");
printjson(db.usuarios.findOne({ _id: comprador._id }, { nome: 1, pontosFidelidade: 1 }));

// esta voltando "undefined" no resultado do Playground, pois nao esta sendo retornado nada.