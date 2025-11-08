// Configuração do banco de dados
const database = 'Somativo';
use(database);

// Criar coleção com validação
db.createCollection("usuarios")

// Inserir exemplos
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
    localizacao: {
      tipo: "Point",
      coordenadas: [-46.6388, -23.5489]
    },
    pontosFidelidade: 150,
    tipoUsuario: "Comprador"
  },
  {
    nome: "Maria Comercial",
    email: "maria@loja.com",
    senha: "hash456",
    endereco: {
      rua: "Avenida Comercial",
      numero: "789",
      cidade: "São Paulo",
      estado: "SP",
      cep: "04567-890"
    },
    localizacao: {
      tipo: "Point",
      coordenadas: [-46.6528, -23.5505]
    },
    pontosFidelidade: 0,
    tipoUsuario: "Vendedor"
  }
]);