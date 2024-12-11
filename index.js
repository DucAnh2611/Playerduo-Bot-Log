const InitApp = require("./api");
const Configs = require("./configs");
const { job } = require("./cron");
const InitDatabase = require("./db");
const { InitClientDiscord } = require("./discord");

function main() {
    InitDatabase();
    InitClientDiscord();
    InitApp();
}

main();

if (Configs.app.env === "prod") {
    job.start();
}
