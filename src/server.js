const express = require('express');
const path = require('path');

const server = express();

server.use(express.static("public"));

server.get("/", (request, response) => {
    response.sendFile(path.resolve(__dirname, 'views', 'index.html'));
});

server.listen(3000, () => console.log("rodando servidor"));