const express = require('express');
const path = require('path');

const routes = require('./routes');
const server = express();

const basePath = path.join(__dirname, 'views');

server.set('view engine', 'ejs');
server.set('views', basePath);

server.use(express.urlencoded({ extended: true }));

server.use(express.static("public"));

server.use(routes);

server.listen(3000, () => console.log("rodando servidor"));