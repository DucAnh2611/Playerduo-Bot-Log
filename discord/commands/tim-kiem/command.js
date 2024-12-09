const { SlashCommandBuilder } = require("discord.js");
const DISCORD_CONSTANTS = require("../../constants");

const DiscordCommandsSearch = new SlashCommandBuilder()
    .setName("tim-kiem")
    .setDescription("Tìm kiếm thông tin playerduo");

module.exports = DiscordCommandsSearch;
