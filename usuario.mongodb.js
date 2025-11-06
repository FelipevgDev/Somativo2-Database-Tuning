use("megadatadog");

// db.usuarios.deleteMany({}); // deletando todos os docs antes de inserir os novos

db.usuarios.insertMany([
  {
    nome: "Felps",
    email: "felps@megadatadog.com",
    senha: "023",
    endereco: "Rua Mongo 78",
    localGeo: {
      type: "Point",
      coordinates: [-46.6333, -23.5505] 
    },
    pontosFidelidade: 120
  },
  {
    nome: "Marina Souza",
    email: "marina@megadatadog.com",
    senha: "abc123",
    endereco: "Av. dos Dados 42",
    localGeo: {
      type: "Point",
      coordinates: [-43.2096, -22.9035] 
    },
    pontosFidelidade: 85
  },
  {
    nome: "Carlos Mendes",
    email: "carlos@megadatadog.com",
    senha: "senha456",
    endereco: "Rua Query 999",
    localGeo: {
      type: "Point",
      coordinates: [-51.2177, -30.0346] 
    },
    pontosFidelidade: 250
  },
  {
    nome: "Juliana Lima",
    email: "juliana@megadatadog.com",
    senha: "123mongo",
    endereco: "Rua Performance 300",
    localGeo: {
      type: "Point",
      coordinates: [-38.5108, -12.9714] 
    },
    pontosFidelidade: 60
  },
  {
    nome: "Renato Silva",
    email: "renato@megadatadog.com",
    senha: "r3n4t0",
    endereco: "Av. Shard 200",
    localGeo: {
      type: "Point",
      coordinates: [-48.5480, -27.5954] 
    },
    pontosFidelidade: 190
  }
]);

// Verificação de inserção
db.usuarios.find().pretty();
