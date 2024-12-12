const Configs = require("../configs");
const rentingJob = require("./rent");
const restartJob = require("./restart");

function RunCronJob() {
    rentingJob.start();

    if (Configs.app.env === "prod") {
        restartJob.start();
    }
}

module.exports = RunCronJob;
