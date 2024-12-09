const InitApp = require("./api");
const InitDatabase = require("./db");
const { InitClientDiscord } = require("./discord");

function main() {
    InitDatabase();
    InitClientDiscord();
    InitApp();
}

main();
