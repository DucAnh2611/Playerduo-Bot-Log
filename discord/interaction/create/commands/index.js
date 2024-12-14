const commandPlayduoHandler = require("../../../commands/playerduo/handler");
const commandInfoHandler = require("../../../commands/thong-tin/handler");
const commandRentHandler = require("../../../commands/thue/handler");

const interactionCreateCommandsHandler = async (interaction) => {
    const { commandName } = interaction;

    switch (commandName) {
        case "thue":
            await commandRentHandler(interaction);
            return;

        case "playduo":
            await commandPlayduoHandler(interaction);
            return;

        case "thong-tin":
            await commandInfoHandler(interaction);
            return;

        default:
            await interaction.reply({
                content: "Tớ đang code hehe!",
                ephemeral: true,
            });
            return;
    }
};

module.exports = interactionCreateCommandsHandler;
