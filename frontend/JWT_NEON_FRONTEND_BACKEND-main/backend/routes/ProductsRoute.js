// crie rotas dos produtos com o authenticateToken para proteger as rotas
const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const authenticateToken = require('../middlewares/auth');



// Rota de boas-vindas (protegida)
router.get('/welcome', authenticateToken, productController.welcomeFunction);
// Rota para criar um novo produto (protegida)
router.post('/products', authenticateToken, productController.createProduct);

// Rota para listar todos os produtos (protegida)
router.get('/products', authenticateToken, productController.listProducts);

// Rota para listar produtos do usuário logado (protegida)
router.get('/me/products', authenticateToken, productController.getProductsByOwner);

// Rota para obter detalhes de um produto específico (protegida)
router.get('/products/:id', authenticateToken, productController.getProductById);

// Rota para atualizar um produto existente (protegida)
router.put('/products/:id', authenticateToken, productController.updateProduct);

// Rota para deletar um produto (protegida)
router.delete('/products/:id', authenticateToken, productController.deleteProduct);

module.exports = router;


// CURL exemplos
// curl -X GET http://localhost:3000/api/products
// curl -X GET http://localhost:3000/me/products 
// curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"descricao":"Produto 1","preco":10.0,"quantidade":5}'
// curl -X PUT http://localhost:3000/api/products/1 -H "Content-Type: application/json" -d '{"descricao":"Produto 1 atualizado","preco":15.0,"quantidade":10}'
// curl -X DELETE http://localhost:3000/api/products/1