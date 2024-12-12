const {
    Client,
    IntentsBitField,
    Routes,
    EmbedBuilder,
    Partials,
} = require("discord.js");
const Configs = require("../configs");
const RegistryDiscordCommands = require("./commands");
const interactionCreateHandler = require("./interaction/create");
const guildMemberAddHandler = require("./guildMember/add");
const roleSelection = require("./role-selection");

let clientDiscord = null;

const InitClientDiscord = () => {
    try {
        const client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.MessageContent,
                IntentsBitField.Flags.GuildMessageReactions,
            ],
            partials: [Partials.Message, Partials.Reaction, Partials.User],
        });
        client.login(Configs.discord.discord_bot_token);

        client.on("ready", () => {
            console.log(`Logged in as ${client.user.tag}!`);
            clientDiscord = client;
        });

        roleSelection(client);

        client.on("interactionCreate", interactionCreateHandler);

        client.on("guildMemberAdd", guildMemberAddHandler);

        RegistryDiscordCommands();
    } catch (err) {
        console.log("Init client discord failed: ", err);
    }
};

const getClientDiscord = () => {
    return clientDiscord || null;
};

module.exports = { getClientDiscord, InitClientDiscord };
