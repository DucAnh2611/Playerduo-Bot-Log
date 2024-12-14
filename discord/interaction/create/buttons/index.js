const ButtonRentEvent = require("../../../commands/thue/buttons");

const interactionCreateButtonHandler = async (interaction) => {
    const buttonsEnvents = [ButtonRentEvent];

    for (const { validation, handler } of buttonsEnvents) {
        if (!!validation && !!handler && validation(interaction)) {
            return handler(interaction);
        }
    }

    await interaction.reply("Có vẻ như có lỗi tại nút cậu vừa ấn!");

    return;
};

module.exports = interactionCreateButtonHandler;
