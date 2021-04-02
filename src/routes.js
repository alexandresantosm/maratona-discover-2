const express = require('express');

const routes = express.Router();

const Profile = {
    data: {
        name: "Jakeliny",
        avatar: "https://github.com/jakeliny.png",
        "monthly-budget": 3000,
        "hours-per-day": 5,
        "days-per-week": 5,
        "vacation-per-year": 4,
        "value-hour": 75,
    },

    controllers: {
        index(req, res) {
            return res.render('profile', { profile: Profile.data });
        },

        update(req, res) {
            const data = req.body;
            const weeksPerYear = 52;
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"];
            const monthlyTotlaHours = weekTotalHours * weeksPerMonth;
            const valueHour = data["monthly-budget"] /monthlyTotlaHours;

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour,
            };

            return res.redirect('/profile');
        },
    }

};

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
            {
                const updatedJobs = Job.data.map((job) => {
                    
                    const remaining = Job.services.calculateRemainingDays(job);
                    const status = remaining <= 0 ? 'done' : 'progress';
                    const budget = Job.services.calculateBudget(job, Profile.data["value-hour"]);
            
                    return {
                        ...job,
                        remaining,
                        status,
                        budget,
                    };
                });
                
                return res.render('index', { jobs: updatedJobs });
            }
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

routes.get("/profile", Profile.controllers.index);

routes.post("/profile", Profile.controllers.update);

module.exports = routes;