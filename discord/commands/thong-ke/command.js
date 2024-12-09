const { SlashCommandBuilder } = require("discord.js");
const DISCORD_CONSTANTS = require("../../constants");

const DiscordCommandStatistic = new SlashCommandBuilder()
    .setName("thong-ke")
    .setDescription("Chi tiết thông tin thuê Player");

module.exports = DiscordCommandStatistic;
