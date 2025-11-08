# Planejamento do Projeto - Marketplace MongoDB

## 📅 Cronograma
- Data de Entrega: 11/11/2025
- Data de Apresentação: 12/11/2025

## 👥 Organização da Equipe
- [ ] Definir equipe (máximo 4 pessoas)
- [ ] Dividir responsabilidades
- [ ] Criar repositório para o projeto
- [ ] Estabelecer canais de comunicação

## 🗄️ Detalhamento das Collections

### Collection: Usuarios
```javascript
{
  _id: ObjectId,
  nome: String,          // Nome completo do usuário
  email: String,         // Email único para login
  senha: String,         // Senha hash
  endereco: {
    rua: String,        // Rua
    numero: String,     // Número
    complemento: String, // Complemento (opcional)
    cidade: String,     // Cidade
    estado: String,     // Estado
    cep: String        // CEP
  },
  localizacao: {
    tipo: "Point",      // Tipo GeoJSON para consultas geoespaciais
    coordenadas: [Number, Number] // [longitude, latitude]
  },
  pontosFidelidade: Number, // Pontos de fidelidade acumulados
  tipoUsuario: String // Comprador ou Vendedor
}

Índices necessários:
- email: unique
- location: 2dsphere (para queries geoespaciais)
```

### Collection: Produtos
```javascript
{
  _id: ObjectId,
  nome: String,         // Nome do produto
  descricao: String,    // Descrição detalhada
  preco: Decimal128,    // Preço atual (usar Decimal128 para precisão monetária)
  quantidade: Number,   // Quantidade em estoque
  idVendedor: ObjectId, // Referência ao usuário vendedor
  localizacao: {
    tipo: "Point",
    coordenadas: [Number, Number]
  },
  categoria: {
    categoriaPrincipal: ObjectId,    // Referência à categoria principal
    subCategorias: [ObjectId]        // Referências às subcategorias
  },
  promocoes: [{
    percentualDesconto: Number,
    dataInicio: Date,
    dataFim: Date,
    ativo: Boolean
  }],
  dataCriacao: Date,
  dataAtualizacao: Date
}

Índices necessários:
- location: 2dsphere
- category.mainCategory: 1
- sellerId: 1
- "promotions.active": 1
```


### Collection: Categorias
```javascript
{
  _id: ObjectId,
  nome: String,        
  nivel: Number,      
}

Índices necessários:
- slug: unique
- parentId: 1
- path: 1
```

### Collection: Transacoes
```javascript
{
  _id: ObjectId,
  idUsuario: ObjectId,  // Comprador
  produtos: [{
    idProduto: ObjectId,
    quantidade: Number,
    precoCompra: Decimal128,
    desconto: {
      tipo: String,     // "fidelidade" ou "promocao"
      valor: Decimal128
    }
  }],
  valorTotal: Decimal128,
  pontosFidelidadeGanhos: Number,
  metodo: String,
  idTransacao: String
  entrega: {
    endereco: {        // Endereço de entrega
      rua: String,
      numero: String,
      complemento: String,
      cidade: String,
      estado: String,
      cep: String
    },
  },
  dataCompra: Date,
}

Índices necessários:
- userId: 1
- "products.productId": 1
- status: 1
- createdAt: 1
```

### Collection: Avaliacoes
```javascript
{
  _id: ObjectId,   
  idUsuario: ObjectId,
  idProduto: ObjectId,
  idTransacao: ObjectId,
  nota: Number,            // 1-5 estrelas
  comentario: String,
  respostaVendedor: {      // Resposta do vendedor
    reposta: String,
    dataResposta: Date
  },
  dataAvaliacao: Date,
}

Índices necessários:
- productId: 1
- userId: 1
- transactionId: 1
- rating: 1
```

- [ ] Criar diagrama DER/UML com todas as collections acima
- [ ] Definir estratégia de documentos incorporados vs referenciados
- [ ] Documentar decisões de modelagem

### 2️⃣ Implementação Base (Prazo: 09/11)

#### Schema Validation
Para cada coleção, implementar JSON Schema com:
- Tipos corretos para cada campo
- Campos obrigatórios
- Restrições de valores (ex: rating entre 1-5)
- Validação de formato (ex: email)

Exemplo para Users:
```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password", "address"],
      properties: {
        name: {
          bsonType: "string",
          description: "Nome completo - obrigatório"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Email válido - obrigatório"
        }
        // ... outros campos
      }
    }
  }
})
```

#### Dados de Exemplo
Criar scripts de seed com:
- 5+ usuários com diferentes perfis
- 10+ produtos em diferentes categorias
- Estrutura completa de categorias
- 7+ transações com diferentes status
- 15+ avaliações distribuídas

#### Implementação de Índices
- [ ] Criar todos os índices definidos para cada collection
- [ ] Documentar justificativa de cada índice
- [ ] Testar performance dos índices

### 3️⃣ Consultas e Otimizações (Prazo: 10/11 manhã)

#### Consultas Básicas
1. Busca de Produtos por Categoria:
```javascript
db.produtos.find({
  "categoria.categoriaPrincipal": ObjectId("...")
})
```

2. Avaliações por Produto:
```javascript
db.avaliacoes.aggregate([
  { $match: { idProduto: ObjectId("...") } },
  { $lookup: { from: "usuarios", ... } }
])
```

3. Nova Transação:
```javascript
db.transacoes.insertOne({
  // Validar estoque
  // Calcular pontos
  // Atualizar quantidade
})
```

#### Agregações
1. Média de Avaliações:
```javascript
db.avaliacoes.aggregate([
  { $group: {
    _id: "$idProduto",
    mediaAvaliacoes: { $avg: "$nota" },
    totalAvaliacoes: { $sum: 1 }
  }}
])
```

2. Total de Vendas por Categoria:
```javascript
db.transacoes.aggregate([
  { $unwind: "$produtos" },
  { $lookup: { from: "produtos", ... } },
  { $group: {
    _id: "$produtos.categoria.categoriaPrincipal",
    totalVendas: { $sum: { $multiply: ["$produtos.quantidade", "$produtos.precoCompra"] } }
  }}
])
```

### 4️⃣ Sprint 2 - Novos Requisitos (Prazo: 10/11 tarde)

#### Promoções Temporárias
```javascript
// Query para produtos em promoção ativa
db.produtos.find({
  "promocoes": {
    $elemMatch: {
      ativo: true,
      dataInicio: { $lte: new Date() },
      dataFim: { $gte: new Date() }
    }
  }
})
```

#### Sistema de Pontos
1. Regras de Negócio:
- 1 ponto para cada R$ 10 em compras
- Pontos expiram após 6 meses
- Mínimo de 100 pontos para usar em compras

2. Atualização de Pontos:
```javascript
db.usuarios.updateOne(
  { _id: idUsuario },
  { 
    $inc: { pontosFidelidade: pontosGanhos },
    $push: { 
      historioPontos: {
        data: new Date(),
        pontos: pontosGanhos,
        idTransacao: idTransacao,
        tipo: "ganho"
      }
    }
  }
)
```

#### Geolocalização
1. Busca por Proximidade:
```javascript
db.produtos.find({
  localizacao: {
    $near: {
      $geometry: {
        tipo: "Point",
        coordenadas: [longitude, latitude]
      },
      $maxDistance: 10000 // 10km
    }
  }
})
```

2. Agregação por Área:
```javascript
db.produtos.aggregate([
  {
    $geoNear: {
      near: { tipo: "Point", coordenadas: [ longitude, latitude ] },
      distanceField: "distancia",
      maxDistance: 5000,
      spherical: true
    }
  },
  {
    $group: {
      _id: "$categoria.categoriaPrincipal",
      quantidade: { $sum: 1 },
      distanciaMedia: { $avg: "$distancia" }
    }
  }
])

### 5️⃣ Performance Tuning (Prazo: 11/11 manhã)

#### Análise de Performance
1. Uso do explain():
```javascript
db.products.find({
  "category.mainCategory": ObjectId("...")
}).explain("executionStats")
```

2. Compound Indexes:
```javascript
// Índice para busca de produtos por categoria e status da promoção
db.products.createIndex({
  "category.mainCategory": 1,
  "promotions.active": 1
})

// Índice para busca de transações por usuário e data
db.transactions.createIndex({
  userId: 1,
  createdAt: -1
})
```

#### Pipelines Avançados
```javascript
// Pipeline com múltiplas agregações paralelas
db.transactions.aggregate([
  {
    $facet: {
      "salesByCategory": [
        { $unwind: "$products" },
        { $group: {
          _id: "$products.category",
          total: { $sum: "$products.price" }
        }}
      ],
      "customerStats": [
        { $group: {
          _id: "$userId",
          totalSpent: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }}
      ],
      "productPerformance": [
        { $unwind: "$products" },
        { $group: {
          _id: "$products.productId",
          quantitySold: { $sum: "$products.quantity" }
        }}
      ]
    }
  }
])
```

#### Estratégias de Sharding
1. Chaves de Shard:
- Users: { state: 1, _id: 1 }
- Products: { "category.mainCategory": 1 }
- Transactions: { createdAt: 1 }

2. Zonas de Dados:
- Distribuir dados por região geográfica
- Otimizar latência de acesso
- Configurar tags de localização

### 6️⃣ Documentação e Entrega (Prazo: 11/11 tarde)
- [ ] Organizar arquivos finais
  - [ ] Scripts comentados
  - [ ] Imagem da modelagem
  - [ ] Documentação das decisões técnicas
- [ ] Preparar apresentação
  - [ ] Slides ou roteiro
  - [ ] Demonstração prática
- [ ] Criar arquivo ZIP com:
  - [ ] Arquivos .js/.json
  - [ ] Imagem da modelagem
  - [ ] README com instruções

## 🎯 Checklist para Apresentação (12/11)
- [ ] Testar todos os scripts
- [ ] Preparar demonstração das consultas
- [ ] Preparar explicação das decisões de modelagem
- [ ] Preparar demonstração das otimizações
- [ ] Organizar tempo de fala da equipe

## 📚 Recursos Necessários
- MongoDB Playground no VS Code
- Ferramenta para modelagem (draw.io, lucidchart, etc.)
- Git para controle de versão
- MongoDB Compass (opcional, para visualização)

## 🚨 Pontos de Atenção
1. Manter backups dos scripts
2. Documentar todas as decisões técnicas
3. Testar queries com volume de dados realista
4. Garantir que todos os scripts estão funcionando no playground
5. Verificar performance das consultas antes da apresentação
