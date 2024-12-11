const { SlashCommandBuilder } = require("discord.js");

const DiscordCommandInfo = new SlashCommandBuilder()
    .setName("thong-tin")
    .setDescription("Thông tin player")
    .addUserOption((option) =>
        option.setName("player").setDescription("Chọn player").setRequired(true)
    );

module.exports = DiscordCommandInfo;
