const Profile = require('../model/Profile');

module.exports = {
    index(req, res) {
        const profile = Profile.get();

        return res.render('profile', { profile });
    },

    update(req, res) {
        const data = req.body;
        const weeksPerYear = 52;
        const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;
        const weekTotalHours = data["hours-per-day"] * data["days-per-week"];
        const monthlyTotlaHours = weekTotalHours * weeksPerMonth;
        const valueHour = data["monthly-budget"] /monthlyTotlaHours;

        const profile = Profile.get();

        const updatedProfile = {
            ...profile,
            ...req.body,
            "value-hour": valueHour,
        };

        Profile.update(updatedProfile);

        return res.redirect('/profile');
    },
}