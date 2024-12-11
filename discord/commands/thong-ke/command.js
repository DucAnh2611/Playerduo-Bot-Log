const { SlashCommandBuilder } = require("discord.js");

const DiscordCommandStatistic = new SlashCommandBuilder()
    .setName("thong-ke")
    .setDescription("Chi tiết thông tin thuê Player")
    .addUserOption((option) =>
        option.setName("player").setDescription("Chọn player").setRequired(true)
    );

module.exports = DiscordCommandStatistic;
