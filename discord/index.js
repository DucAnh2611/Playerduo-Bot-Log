const {
    Client,
    IntentsBitField,
    Partials,
    ActivityType,
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

        const regisEvents = [
            {
                name: "ready",
                handler: () => {
                    console.log(`Logged in as ${client.user.tag}!`);
                    clientDiscord = client;

                    client.user.setActivity({
                        type: ActivityType.Listening,
                        name: "/thue",
                    });
                },
            },
            {
                name: "interactionCreate",
                handler: interactionCreateHandler,
            },
            {
                name: "guildMemberAdd",
                handler: guildMemberAddHandler,
            },
        ];

        regisEvents.forEach((event) => {
            client.on(event.name, event.handler);
        });

        roleSelection(client);

        RegistryDiscordCommands();
    } catch (err) {
        console.log("Init client discord failed: ", err);
    }
};

const getClientDiscord = () => {
    return clientDiscord || null;
};

module.exports = { getClientDiscord, InitClientDiscord };
