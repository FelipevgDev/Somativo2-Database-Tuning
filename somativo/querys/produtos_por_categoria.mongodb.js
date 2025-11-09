use("Somativo");

const categoriaNome = "Eletrônicos";

db.categorias.aggregate([
  // 1️⃣ Encontra a categoria pelo nome
  { $match: { nome: categoriaNome } },

  // 2️⃣ Faz o join com produtos, comparando ObjectIds corretamente
  {
    $lookup: {
      from: "produtos",
      let: { categoriaId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$categoria.categoriaPrincipal", "$$categoriaId"]
            }
          }
        },
        {
          $project: {
            nome: 1,
            preco: 1,
            categoria: 1
          }
        }
      ],
      as: "produtos"
    }
  },

  // 3️⃣ Opcional: só categorias com produtos
  {
    $match: { "produtos.0": { $exists: true } }
  }
]).pretty();
