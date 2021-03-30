const express = require('express');

const routes = express.Router();

const profile = {
    name: "Jakeliny",
    avatar: "https://avatars.githubusercontent.com/u/17316392?s=460&u=6912a91a70bc89745a2079fdcdad3bc3ce370f13&v=4",
    "monthly-budget": 3000,
    "hours-per-day": 5,
    "days-per-week": 5,
    "vacation-per-year": 4
}

routes.get("/", (req, res) => res.render('index'));
routes.get("/job", (req, res) => res.render('job'));
routes.get("/job/edit", (req, res) => res.render('job-edit'));
routes.get("/profile", (req, res) => res.render('profile', {profile}));

module.exports = routes;