const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');
const { authRoute, 
        categoriesRoute, 
        productsRoute, 
        userRoute, 
        searchRoute} = require('../routers');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.paths = {
      authPath: '/api/auth',
      categoriesPath: '/api/categories',
      productsPath: '/api/products',
      searchPath: '/api/search',
      usersPath: '/api/users'
    }

    // Config Database
    this.connectDB();

    // Config Middlewares
    this.middlewares();

    // Config Routes
    this.routes();
  }

  async connectDB(){
    await dbConnection();
  }

  middlewares(){
    // Cors
    this.app.use(cors());
    
    // Read and parse to body
    this.app.use(express.json());

    // Public directory
    this.app.use(express.static('public'));
  }

  routes(){
    this.app.use(this.paths.authPath, authRoute);
    this.app.use(this.paths.categoriesPath, categoriesRoute);
    this.app.use(this.paths.usersPath, userRoute);
    this.app.use(this.paths.searchPath, searchRoute);
    this.app.use(this.paths.productsPath, productsRoute);
  }

  listen(){
    this.app.listen(this.port, () => {
      console.log(`aplicación corriendo en http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;