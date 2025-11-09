// Configuração do banco de dados
const database = 'Somativo';
use(database);

// Criar coleção com validação
db.createCollection("transacoes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["idUsuario", "produtos", "valorTotal", "pontosFidelidadeGanhos", "metodo", "idTransacao", "entrega", "dataCompra"],
      properties: {
        idUsuario: { bsonType: "objectId" },
        produtos: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["idProduto", "quantidade", "precoCompra"],
            properties: {
              idProduto: { bsonType: "objectId" },
              quantidade: { bsonType: "int", minimum: 1 },
              precoCompra: { bsonType: ["decimal", "double"] }
            }
          }
        },
        valorTotal: { bsonType: ["decimal", "double"] },
        pontosFidelidadeGanhos: { bsonType: "int" },
        metodo: { enum: ["credito", "debito", "pix", "boleto"] },
        idTransacao: { bsonType: "string" },
        entrega: {
          bsonType: "object",
          required: ["endereco"],
          properties: {
            endereco: {
              bsonType: "object",
              required: ["rua", "numero", "cidade", "estado", "cep"],
              properties: {
                rua: { bsonType: "string" },
                numero: { bsonType: "string" },
                complemento: { bsonType: "string" },
                cidade: { bsonType: "string" },
                estado: { bsonType: "string" },
                cep: { bsonType: "string" }
              }
            }
          }
        },
        dataCompra: { bsonType: "date" }
      }
    }
  }
});

// Inserir exemplos
db.transacoes.insertMany([
  {
    idUsuario: db.usuarios.findOne()._id,
    produtos: [{
      idProduto: db.produtos.findOne()._id,
      quantidade: 1,
      precoCompra: NumberDecimal("2499.99")
    }],
    valorTotal: NumberDecimal("2250.00"),
    pontosFidelidadeGanhos: 225,
    metodo: "credito",
    idTransacao: "TRX" + new Date().getTime(),
    entrega: {
      endereco: {
        rua: "Rua das Flores",
        numero: "123",
        complemento: "Apto 101",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567"
      }
    },
    dataCompra: new Date()
  }
]);