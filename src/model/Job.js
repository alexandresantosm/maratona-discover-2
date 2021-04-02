let data = [
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

module.exports = {
    get() {
        return data;
    },

    save(newJob) {
        data = [
            ...data,
            newJob,
        ];
    },

    find(id) {
        const job = data.find(job => Number(job.id) === Number(id));

        return job;
    },

    update(newJobs) {
        data = newJobs;
    },

    delete(id) {
        const deletedJobs = data.filter(job => Number(job.id) !== Number(id));

        data = deletedJobs;
    },
}