// Configuração do banco de dados
const database = 'Somativo';
use(database);

print('\n========== INICIALIZANDO AVALIACOES ==========\n');

// 1. Verificar se coleções dependentes existem
const colecoes = db.getCollectionNames();
const faltam = [];
if (!colecoes.includes('usuarios')) faltam.push('usuarios');
if (!colecoes.includes('produtos')) faltam.push('produtos');
if (!colecoes.includes('transacoes')) faltam.push('transacoes');

if (faltam.length > 0) {
  print('❌ ERRO: Faltam coleções pré-requisito:');
  faltam.forEach(c => print('   - ' + c));
  print('\n⚠️  Execute ANTES: usuario.mongodb.js, produto.mongodb.js, transacoes.mongodb.js');
  quit();
}

// 2. Buscar dados válidos
const comprador = db.usuarios.findOne({ tipoUsuario: "Comprador" });
const smartphone = db.produtos.findOne({ nome: "Smartphone XYZ" });
const notebook = db.produtos.findOne({ nome: "Notebook ABC" });
const transacao = db.transacoes.findOne();

if (!comprador || !smartphone || !notebook || !transacao) {
  print('❌ ERRO: Dados não encontrados no banco:');
  if (!comprador) print('   - Nenhum usuário comprador');
  if (!smartphone) print('   - Produto "Smartphone XYZ" não existe');
  if (!notebook) print('   - Produto "Notebook ABC" não existe');
  if (!transacao) print('   - Nenhuma transação existe');
  print('\n⚠️  Verifique se os scripts anteriores executaram corretamente.');
  quit();
}

print('✅ Dados pré-requisito encontrados\n');

// 3. Recriar coleção avaliacoes (ou usar existente)
try {
  db.avaliacoes.drop();
  print('✓ Coleção anterior removida');
} catch (e) {
  // Coleção não existe, continua
}

// 4. Criar coleção com validação
db.createCollection("avaliacoes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["idUsuario", "idProduto", "idTransacao", "nota", "comentario", "dataAvaliacao"],
      properties: {
        idUsuario: {
          bsonType: "objectId",
          description: "Referência ao usuário que fez a avaliação"
        },
        idProduto: {
          bsonType: "objectId",
          description: "Referência ao produto avaliado"
        },
        idTransacao: {
          bsonType: "objectId",
          description: "Referência à transação associada à compra"
        },
        nota: {
          bsonType: "int",
          minimum: 1,
          maximum: 5,
          description: "Avaliação de 1 a 5 estrelas"
        },
        comentario: {
          bsonType: "string",
          description: "Comentário textual do comprador"
        },
        respostaVendedor: {
          bsonType: ["object", "null"],
          properties: {
            resposta: { bsonType: "string" },
            dataResposta: { bsonType: "date" }
          },
          description: "Resposta opcional do vendedor"
        },
        dataAvaliacao: {
          bsonType: "date",
          description: "Data em que o usuário fez a avaliação"
        },
        ultimaAtualizacao: {
          bsonType: ["date", "null"],
          description: "Data da última modificação da avaliação (opcional)"
        }
      }
    }
  }
});

print('✓ Coleção "avaliacoes" criada com sucesso\n');

// 5. Inserir exemplos com dados VÁLIDOS
const avaliacoes = [
  {
    idUsuario: comprador._id,
    idProduto: smartphone._id,
    idTransacao: transacao._id,
    nota: 5,
    comentario: "Excelente produto, chegou antes do prazo!",
    respostaVendedor: {
      resposta: "Obrigado pela avaliação! Ficamos felizes em atender suas expectativas.",
      dataResposta: new Date()
    },
    dataAvaliacao: new Date(),
    ultimaAtualizacao: new Date()
  },
  {
    idUsuario: comprador._id,
    idProduto: notebook._id,
    idTransacao: transacao._id,
    nota: 4,
    comentario: "Produto bom, mas a entrega demorou um pouco.",
    respostaVendedor: null,
    dataAvaliacao: new Date(),
    ultimaAtualizacao: null
  }
];

const resultado = db.avaliacoes.insertMany(avaliacoes);
print('✓ ' + resultado.insertedIds.length + ' avaliações inseridas\n');

// 6. Criar índices
db.avaliacoes.createIndex({ idProduto: 1 });
db.avaliacoes.createIndex({ idUsuario: 1 });
db.avaliacoes.createIndex({ nota: -1 });
print('✓ Índices criados\n');

print('========== AVALIACOES INICIALIZADAS COM SUCESSO! ==========\n');
