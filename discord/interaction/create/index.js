const interactionCreateButtonHandler = require("./buttons");
const interactionCreateCommandsHandler = require("./commands");
const interactionCreateAutoCompleteHandler = require("./auto-completes");

async function interactionCreateHandler(interaction) {
    const checks = [
        {
            check: "isButton",
            callback: interactionCreateButtonHandler,
        },
        {
            check: "isCommand",
            callback: interactionCreateCommandsHandler,
        },
        {
            check: "isAutocomplete",
            callback: interactionCreateAutoCompleteHandler,
        },
    ];

    for (const { check, callback } of checks) {
        if (interaction[check] && interaction[check]()) {
            return callback(interaction);
        }
    }

    return;
}

module.exports = interactionCreateHandler;
