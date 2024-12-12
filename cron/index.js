const Configs = require("../configs");
const restartJob = require("./restart");

function RunCronJob() {
    if (Configs.app.env === "prod") {
        restartJob.start();
    }
}

module.exports = RunCronJob;
