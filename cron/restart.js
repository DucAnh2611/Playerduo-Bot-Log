const cron = require("cron");
const https = require("https");
const http = require("http");
const Configs = require("../configs");

const backendUrl = Configs.app.url;
const restartJob = new cron.CronJob("*/14 * * * *", function () {
    console.log("Restarting server at:", backendUrl + "/restart");

    const method = Configs.app.env === "dev" ? http : https;

    method
        .get(backendUrl + "/restart", (res) => {
            if (res.statusCode === 200) {
                console.log("Server restarted");
            } else {
                console.log("Reset failed with code", res.statusCode);
            }
        })
        .on("error", (error) => {
            console.error("https throw: ", error);
        });
});

module.exports = restartJob;
