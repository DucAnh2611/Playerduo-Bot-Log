const InitApp = require("./api");
const { job } = require("./cron");
const InitDatabase = require("./db");
const { InitClientDiscord } = require("./discord");

function main() {
    InitDatabase();
    InitClientDiscord();
    InitApp();
}

main();

job.start();
