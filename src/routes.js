const express = require('express');
const path = require('path');

const routes = express.Router();

const basePath = path.resolve(__dirname, 'views');

routes.get("/", (request, response) => response.sendFile(path.resolve(basePath, 'index.html')));
routes.get("/job", (request, response) => response.sendFile(path.resolve(basePath, 'job.html')));
routes.get("/job/edit", (request, response) => response.sendFile(path.resolve(basePath, 'job-edit.html')));
routes.get("/profile", (request, response) => response.sendFile(path.resolve(basePath, 'profile.html')));

module.exports = routes;