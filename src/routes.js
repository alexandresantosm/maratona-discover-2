const express = require('express');

const routes = express.Router();

const profile = {
    name: "Jakeliny",
    avatar: "https://github.com/jakeliny.png",
    "monthly-budget": 3000,
    "hours-per-day": 5,
    "days-per-week": 5,
    "vacation-per-year": 4,
    "value-hour": 75,
};

let jobs = [
    {
        "id": 1,
        "name": "Pizzaria Guloso",
        "daily-hours": 2,
        "total-hours": 1,
        "created_at": Date.now(),
    },
    {
        "id": 2,
        "name": "OneTwo Project",
        "daily-hours": 3,
        "total-hours": 47,
        "created_at": Date.now(),
    },
];

function calculateRemainingDays(job) {
    const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();
        
    const createdDaTe = new Date(job.created_at);
    const dueDay = createdDaTe.getDate() + Number(remainingDays);
    const dueDateInMs = createdDaTe.setDate(dueDay);
    
    const timeDiffInMs = dueDateInMs - Date.now();

    const daysInMs = 1000 * 60 * 60 * 24;
    const daysDiff = Math.floor(timeDiffInMs / daysInMs);

    return daysDiff;
}

routes.get("/", (req, res) => {
    const updatedJobs = jobs.map((job) => {
        
        const remaining = calculateRemainingDays(job);
        const status = remaining <= 0 ? 'done' : 'progress';
        const budget = profile["value-hour"] * job["total-hours"];

        return {
            ...job,
            remaining,
            status,
            budget,
        };
    });
    
    return res.render('index', { jobs: updatedJobs });
});

routes.get("/job", (req, res) => res.render('job'));

routes.post("/job", (req, res) => {
    const lastId = jobs[jobs.length -1]?.id || 1;

    const newJob = {
        "id": lastId + 1,
        "name": req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        "created_at": Date.now(),
    };

    jobs = [...jobs, newJob];

    return res.redirect('/');
});

routes.get("/job/edit", (req, res) => res.render('job-edit'));

routes.get("/profile", (req, res) => res.render('profile', {profile}));

module.exports = routes;