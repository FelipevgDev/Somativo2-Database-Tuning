// Banco de dados
use('Somativo');

// ===== Buscar produtos por nome da categoria =====
const nomeCategoria = "Eletrônicos"; // Altere aqui o nome da categoria desejada

db.categorias.aggregate([
    // Primeiro encontra a categoria pelo nome
    { $match: { 
        nome: nomeCategoria 
    }},
    // Busca os produtos que têm essa categoria
    { $lookup: {
        from: "produtos",
        let: { categoriaId: "$_id" },
        pipeline: [
            { $match: {
                $expr: { 
                    $eq: ["$categoria.categoriaPrincipal", "$$categoriaId"]
                }
            }},
            // Busca informações do vendedor
            { $lookup: {
                from: "usuarios",
                localField: "idVendedor",
                foreignField: "_id",
                as: "vendedor"
            }},
            { $unwind: "$vendedor" }
        ],
        as: "produtos"
    }},
    { $unwind: "$produtos" },
    // Formata o resultado final
    { $project: {
        _id: "$produtos._id",
        nome: "$produtos.nome",
        descricao: "$produtos.descricao",
        preco: "$produtos.preco",
        quantidade: "$produtos.quantidade",
        vendedor: "$produtos.vendedor.nome",
        categoria: "$nome",
        promocoes: "$produtos.promocoes"
    }}
]);

// Observações:
// - Substitua "REPLACE_WITH_ID_CATEGORIA" pelo ObjectId correto da collection `categorias`.
// - Para executar: abra este arquivo no MongoDB Playground do VS Code e rode o script.
// - Se a coleção `categorias` estiver vazia, a agregação com $lookup não retornará resultados.