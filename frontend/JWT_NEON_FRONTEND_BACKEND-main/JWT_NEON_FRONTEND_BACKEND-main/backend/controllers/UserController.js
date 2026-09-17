
const express = require('express')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = require("../config/db");



async function registerUser (req, res) {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const user = await prisma.user.create({
        data: { email, username, password: hashedPassword },
      });
      res.json({ message: "User registered successfully", user });
    } catch (err) {
      res.status(400).json({ error: "User already exists" });
    }
  }
  
  // Login de usuário
  async function doLogin(req, res) {
    const { username, password } = req.body;
  
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
  
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: "Invalid credentials" });
  
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  
    res.json({ token });
  }
  

module.exports = {
    registerUser,
    doLogin
}