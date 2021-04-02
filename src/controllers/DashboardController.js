const Job = require('../model/Job');
const Profile = require('../model/Profile');
const JobUtils = require('../utils/JobUtils');

module.exports = {
    index(req, res) {
        const jobs = Job.get();
        const profile = Profile.get();

        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length,
        };

        let jobTotalHours = 0;

        const updatedJobs = jobs.map((job) => {
            
            const remaining = JobUtils.calculateRemainingDays(job);
            const status = remaining <= 0 ? 'done' : 'progress';

            const budget = JobUtils.calculateBudget(job, profile["value-hour"]);

            statusCount[status] += 1;

            jobTotalHours = status === 'progress' && jobTotalHours + Number(job["daily-hours"]);

            return {
                ...job,
                remaining,
                status,
                budget,
            };
        });
        
        const freeHours = profile["hours-per-day"] - jobTotalHours;

        return res.render('index', { jobs: updatedJobs, profile, statusCount, freeHours });
    },
};