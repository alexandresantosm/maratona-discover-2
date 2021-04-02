module.exports = {
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
}