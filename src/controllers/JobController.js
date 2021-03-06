const Job = require('../model/Job');
const Profile = require('../model/Profile');
const JobUtils = require('../utils/JobUtils');

module.exports = {
    create(req, res) {
        return res.render('job');
    },

    save(req, res) {
        const jobs = Job.get();

        const lastId = jobs[jobs.length -1]?.id || 0;
    
        const newJob = {
            "id": lastId + 1,
            "name": req.body.name,
            "daily-hours": req.body["daily-hours"],
            "total-hours": req.body["total-hours"],
            "created_at": Date.now(),
        };
    
        Job.save(newJob);
    
        return res.redirect('/');
    },

    show(req, res) {
        const jobId = req.params.id;
        const profile = Profile.get();

        const job = Job.find(jobId);

        if (!job) {
         return res.status(404).send('Job not found!');   
        }

        job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);

        return res.render('job-edit', { job });
    },

    update(req, res) {
        const jobId = req.params.id;

        const job = Job.find(jobId);
        const jobs = Job.get();

        if (!job) {
         return res.status(404).send('Job not found!');   
        }

        const updatedJob = {
            ...job,
            "name": req.body.name,
            "total-hours": req.body["total-hours"],
            "daily-hours": req.body["daily-hours"],
        };

        const updatedJobs = jobs.map(job => {
            if (Number(job.id) === Number(jobId)) {
                job = updatedJob;
            }

            return job;
        });

        Job.update(updatedJobs);

        return res.redirect(`/job/${jobId}`);
    },

    delete(req, res) {
        const jobId = req.params.id;

        Job.delete(jobId);

        return res.redirect('/');
    },
};