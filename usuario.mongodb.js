const database = 'Somativo';
use(database);

// ==========================
// 🧹 Limpa coleções antigas
// ==========================
//db.usuarios.drop();

// ==========================
// 👤 Criação da coleção USUÁRIOS
// ==========================
db.createCollection("usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "nome",
        "email",
        "senha",
        "endereco",
        "localizacao",
        "pontosFidelidade",
        "tipoUsuario",
        "dataCadastro"
      ],
      properties: {
        nome: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
        senha: { bsonType: "string", minLength: 6 },
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
        },
        localizacao: {
          bsonType: "object",
          required: ["type", "coordinates"],
          properties: {
            type: { enum: ["Point"] },
            coordinates: {
              bsonType: "array",
              minItems: 2,
              maxItems: 2,
              items: { bsonType: "double" }
            }
          }
        },
        pontosFidelidade: { bsonType: "int", minimum: 0 },
        tipoUsuario: { enum: ["Comprador", "Vendedor"] },
        dataCadastro: { bsonType: "date" }
      }
    }
  }
});

// ==========================
// 👤 Inserção de usuários
// ==========================
db.usuarios.insertMany([
  {
    nome: "João Silva",
    email: "joao@email.com",
    senha: "hash123",
    endereco: {
      rua: "Rua das Flores",
      numero: "123",
      complemento: "Apto 101",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567"
    },
    localizacao: { type: "Point", coordinates: [-46.6388, -23.5489] },
    pontosFidelidade: 150,
    tipoUsuario: "Comprador",
    dataCadastro: new Date("2025-01-15")
  },
  {
    nome: "Maria Comercial",
    email: "maria@loja.com",
    senha: "hash456",
    endereco: {
      rua: "Avenida Comercial",
      numero: "789",
      complemento: "",
      cidade: "São Paulo",
      estado: "SP",
      cep: "04567-890"
    },
    localizacao: { type: "Point", coordinates: [-46.6528, -23.5505] },
    pontosFidelidade: 0,
    tipoUsuario: "Vendedor",
    dataCadastro: new Date("2025-02-02")
  },
  {
    nome: "Carlos Lima",
    email: "carlos.lima@example.com",
    senha: "hash789",
    endereco: {
      rua: "Rua das Palmeiras",
      numero: "456",
      complemento: "Casa",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "22041-001"
    },
    localizacao: { type: "Point", coordinates: [-43.1803, -22.9711] },
    pontosFidelidade: 320,
    tipoUsuario: "Comprador",
    dataCadastro: new Date("2025-02-10")
  },
  {
    nome: "Ana Souza",
    email: "ana.souza@loja.com",
    senha: "senha@123",
    endereco: {
      rua: "Rua da Liberdade",
      numero: "12",
      complemento: "",
      cidade: "Belo Horizonte",
      estado: "MG",
      cep: "30140-000"
    },
    localizacao: { type: "Point", coordinates: [-43.9378, -19.9208] },
    pontosFidelidade: 210,
    tipoUsuario: "Vendedor",
    dataCadastro: new Date("2025-03-05")
  },
  {
    nome: "Rafael Mendes",
    email: "rafael.mendes@email.com",
    senha: "senha999",
    endereco: {
      rua: "Av. Paulista",
      numero: "999",
      complemento: "Apto 42",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01311-200"
    },
    localizacao: { type: "Point", coordinates: [-46.6511, -23.5632] },
    pontosFidelidade: 410,
    tipoUsuario: "Comprador",
    dataCadastro: new Date("2025-04-20")
  }
]);

// Índices de usuários
db.usuarios.createIndex({ email: 1 }, { unique: true });
db.usuarios.createIndex({ localizacao: "2dsphere" });
db.usuarios.createIndex({ pontosFidelidade: -1 });
db.usuarios.createIndex({ tipoUsuario: 1 });
