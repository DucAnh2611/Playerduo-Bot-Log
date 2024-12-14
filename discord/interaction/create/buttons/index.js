const ButtonRentEvent = require("../../../commands/thue/buttons");

const interactionCreateButtonHandler = async (interaction) => {
    const buttonsEnvents = [ButtonRentEvent];

    for (const { validation, handler } of buttonsEnvents) {
        if (!!validation && !!handler && validation(interaction)) {
            return handler(interaction);
        }
    }

    return;
};

module.exports = interactionCreateButtonHandler;
