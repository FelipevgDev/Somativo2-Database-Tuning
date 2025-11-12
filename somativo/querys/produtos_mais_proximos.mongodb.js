use('Somativo');

// Definir o e-mail do usuário e o raio da busca (em metros)
const emailUsuario = "joao@email.com";
const raioMetros = 5000; // 5 km

// Buscar o usuário e sua localização
const usuario = db.usuarios.findOne({ email: emailUsuario });

if (!usuario || !usuario.localizacao) {
  print("Usuário não encontrado ou sem localização registrada.");
  quit();
}

// Buscar produtos próximos à localização do usuário
db.produtos.find({
  localizacao: {
    $near: {
      $geometry: usuario.localizacao,
      $maxDistance: raioMetros
    }
  }
}, {
  nome: 1,
  preco: 1,
  "localizacao.coordenadas": 1,
  _id: 0
}).pretty();
