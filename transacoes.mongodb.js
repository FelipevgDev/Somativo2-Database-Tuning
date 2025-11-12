const database = 'Somativo';
use(database);


db.createCollection("transacoes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "idUsuario",
        "produtos",
        "valorTotal",
        "metodo",
        "idTransacao",
        "entrega",
        "dataCompra",
        "status"
      ],
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
        valorTotal: { bsonType: ["decimal", "double"], minimum: 0 },
        pontosFidelidadeGanhos: {
          bsonType: "int",
          minimum: 0,
          description: "Pontos de fidelidade obtidos nesta transação"
        },
        metodo: { enum: ["credito", "debito", "pix", "boleto"] },
        idTransacao: { bsonType: "string" },
        status: {
          enum: ["pendente", "pago", "enviado", "concluido", "cancelado"],
          description: "Status atual da transação"
        },
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
                complemento: { bsonType: ["string", "null"] },
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

db.transacoes.insertMany([
  {
    idUsuario: db.usuarios.findOne({ tipoUsuario: "Comprador" })._id,
    produtos: [
      {
        idProduto: db.produtos.findOne({ nome: "Smartphone XYZ" })._id,
        quantidade: 1,
        precoCompra: NumberDecimal("2499.99")
      }
    ],
    valorTotal: NumberDecimal("2250.00"),
    pontosFidelidadeGanhos: 225,
    metodo: "credito",
    idTransacao: "TRX" + new Date().getTime(),
    status: "concluido",
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

// Índices recomendados
db.transacoes.createIndex({ idUsuario: 1 });
db.transacoes.createIndex({ idTransacao: 1 }, { unique: true });


