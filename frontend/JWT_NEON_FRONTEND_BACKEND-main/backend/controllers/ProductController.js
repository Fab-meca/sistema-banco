  // Rota protegida
const express = require('express')
const prisma = require("../config/db");



  async function welcomeFunction (req, res) {
    res.json({ message: `Bem-vindo ${req.user.username}` });
  }
  
  
  async function listProducts (req, res) {
      try {
        const products = await prisma.product.findMany();
        res.json(products);
      } catch (err) {
        res.status(500).json({ error: "Error fetching products" });
      }
  }

  async function getProductsByOwner (req, res) {
    try {
      const products = await prisma.product.findMany({
        where: {
          userId: req.user.id,
        },
      });
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: "Error fetching products" });
    }
  }



  async function getProductById (req, res) {
      try {
        const product = await prisma.product.findUnique({
          where: {
            id: req.params.id,
          },
        });
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
      } catch (err) {
        res.status(500).json({ error: "Error fetching product" });
      }
  }


  async function createProduct (req, res) {
    console.log("User ID from token:", req.user.id); // Log the user ID from the token
    console.log("Request body:", req.body); // Log the request body to see what data is being sent
      try {
        const product = await prisma.product.create({
          data: {
            descricao: req.body.descricao,
            preco: req.body.preco,
            quantidade: req.body.quantidade,
            userId: req.user.id
          },
        });
        res.json(product);
      } catch (err) {
        res.status(500).json({ error: "Error creating product", errors:err });
      }
      
  }

 async function deleteProduct (req, res) {
      try {
        const product = await prisma.product.delete({
          where: {
            id: req.params.id,
          },
        });
        res.json(product);
      } catch (err) {
        res.status(500).json({ error: "Error deleting product" });
      }
 }
 
 async function updateProduct (req, res) {
      try {
        const product = await prisma.product.update({
          where: {
            id: req.params.id,
          },
          data: {
            descricao: req.body.descricao,
            preco: req.body.preco,
            quantidade: req.body.quantidade,
            userId: req.user.id

          },
        });
        res.json(product);
      } catch (err) {
        console.log("Error updating product:", err); // Log the error for debugging
        res.status(500).json({ error: "Error updating product" });
      }
 }


    module.exports = {
      welcomeFunction,
      listProducts,
      getProductsByOwner,
      getProductById,
      createProduct,
      deleteProduct,
      updateProduct
    }