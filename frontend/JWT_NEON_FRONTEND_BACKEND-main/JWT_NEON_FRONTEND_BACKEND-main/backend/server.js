const express = require('express');
const cors = require('cors');
const productsRoutes = require('./routes/ProductsRoute');
const usersRoutes = require('./routes/UsersRoute');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

app.use ('/api/', productsRoutes);
app.use (usersRoutes);

// Sample route

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});