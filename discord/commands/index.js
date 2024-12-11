const { REST, Routes } = require("discord.js");
const Configs = require("../../configs");
const DiscordCommandsRent = require("./thue/command");
const DiscordCommandPlayduo = require("./playerduo/command");
const DiscordCommandStatistic = require("./thong-ke/command");
const DiscordCommandInfo = require("./thong-tin/command");

const RegistryDiscordCommands = async () => {
    try {
        const rest = new REST({ version: "10" }).setToken(
            Configs.discord.discord_bot_token
        );

        await rest.put(Routes.applicationCommands(Configs.discord.client_id), {
            body: [
                DiscordCommandsRent,
                DiscordCommandPlayduo,
                DiscordCommandStatistic,
                DiscordCommandInfo,
            ],
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

module.exports = RegistryDiscordCommands;
