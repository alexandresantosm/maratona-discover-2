let data = {
    name: "Jakeliny",
    avatar: "https://github.com/jakeliny.png",
    "monthly-budget": 3000,
    "hours-per-day": 5,
    "days-per-week": 5,
    "vacation-per-year": 4,
    "value-hour": 75,
};

module.exports = {
    get() {
        return data;
    },

    update(newProfile) {
        data = newProfile;
    },
}