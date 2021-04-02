const express = require('express');

const routes = express.Router();

const ProfileController = require('./controllers/ProfileController');
const Profile = require('./model/Profile');

const Job = {
    data: [
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
    ],

    controllers: {
        index(req, res) {
            const updatedJobs = Job.data.map((job) => {
                
                const remaining = Job.services.calculateRemainingDays(job);
                const status = remaining <= 0 ? 'done' : 'progress';
                const profile = Profile.get();
                const budget = Job.services.calculateBudget(job, profile["value-hour"]);
        
                return {
                    ...job,
                    remaining,
                    status,
                    budget,
                };
            });
            
            return res.render('index', { jobs: updatedJobs });
        },

        create(req, res) {
            return res.render('job');
        },

        save(req, res) {
            const lastId = Job.data[Job.data.length -1]?.id || 0;
        
            const newJob = {
                "id": lastId + 1,
                "name": req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                "created_at": Date.now(),
            };
        
            Job.data = [...Job.data, newJob];
        
            return res.redirect('/');
        },

        show(req, res) {
            const jobId = req.params.id;

            const job = Job.data.find(job => Number(job.id) === Number(jobId));

            if (!job) {
             return res.status(404).send('Job not found!');   
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"]);

            return res.render('job-edit', { job });
        },

        update(req, res) {
            const jobId = req.params.id;

            const job = Job.data.find(job => Number(job.id) === Number(jobId));

            if (!job) {
             return res.status(404).send('Job not found!');   
            }

            const updatedJob = {
                ...job,
                "name": req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"],
            };

            Job.data = Job.data.map(job => {
                if (Number(job.id) === Number(jobId)) {
                    job = updatedJob;
                }

                return job;
            });

            return res.redirect(`/job/${jobId}`);
        },

        delete(req, res) {
            const jobId = req.params.id;

            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId));

            return res.redirect('/');
        },
    },

    services: {
        calculateRemainingDays(job) {
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();
                
            const createdDaTe = new Date(job.created_at);
            const dueDay = createdDaTe.getDate() + Number(remainingDays);
            const dueDateInMs = createdDaTe.setDate(dueDay);
            
            const timeDiffInMs = dueDateInMs - Date.now();
        
            const daysInMs = 1000 * 60 * 60 * 24;
            const daysDiff = Math.floor(timeDiffInMs / daysInMs);
        
            return daysDiff;
        },

        calculateBudget: (job, valueHour) => valueHour * job["total-hours"],
    },
};

routes.get("/", Job.controllers.index);

routes.get("/job", Job.controllers.create);

routes.post("/job", Job.controllers.save);

routes.get("/job/:id", Job.controllers.show);

routes.post("/job/:id", Job.controllers.update);

routes.post("/job/delete/:id", Job.controllers.delete);

routes.get("/profile", ProfileController.index);

routes.post("/profile", ProfileController.update);

module.exports = routes;