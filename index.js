const InitApp = require("./api");
const RunCronJob = require("./cron");
const InitDatabase = require("./db");
const { InitClientDiscord } = require("./discord");

function main() {
    InitDatabase();
    InitClientDiscord();
    InitApp();
    RunCronJob();
}

main();
