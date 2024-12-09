const { SlashCommandBuilder } = require("discord.js");
const DISCORD_CONSTANTS = require("../../constants");

const DiscordCommandsRent = new SlashCommandBuilder()
    .setName("thue")
    .setDescription("Thuê player")
    .addUserOption((option) =>
        option.setName("player").setDescription("Chọn player").setRequired(true)
    )
    .addIntegerOption((option) =>
        option
            .setName("thoi-gian")
            .setDescription("Thời gian thuê (giờ)")
            .setRequired(true)
    )
    .addIntegerOption((option) =>
        option
            .setName("so-tien")
            .setDescription("Số tiền (nếu khác)")
            .setRequired(false)
    );

module.exports = DiscordCommandsRent;
