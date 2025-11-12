const database = 'Somativo';
use(database);

db.createCollection("promocoes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["idProduto", "nome", "descontoPercentual", "dataInicio", "dataFim"],
      properties: {
        idProduto: { bsonType: "objectId" },
        nome: { bsonType: "string" },
        descontoPercentual: { bsonType: "double", minimum: 0, maximum: 100 },
        dataInicio: { bsonType: "date" },
        dataFim: { bsonType: "date" }
      }
    }
  }
});

db.promocoes.insertMany([
  {
    idProduto: db.produtos.findOne()._id,
    nome: "Promoção de Natal",
    descontoPercentual: 15.0,
    dataInicio: new Date("2025-12-01"),
    dataFim: new Date("2025-12-31")
  },
  {
    idProduto: db.produtos.findOne()._id,
    nome: "Semana do Consumidor",
    descontoPercentual: 10.0,
    dataInicio: new Date("2025-03-10"),
    dataFim: new Date("2025-03-17")
  }
]);
