const commandPlayerDuoAutoCompleteHandler = require("../../../commands/playerduo/auto-complete");

const interactionCreateAutoCompleteHandler = async (interaction) => {
    const { commandName } = interaction;

    switch (commandName) {
        case "playduo":
            await commandPlayerDuoAutoCompleteHandler(interaction);
            return;

        default:
            await interaction.reply({
                content: "Tớ đang code hehe!",
                ephemeral: true,
            });
            return;
    }
};

module.exports = interactionCreateAutoCompleteHandler;
