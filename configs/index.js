require("dotenv").config();

const env = process.env;

const Configs = {
    app: {
        env: env.NODE_ENV || "dev",
        port: env.PORT || 3000,
        url: env.APP_URL || "http://localhost:3000",
    },
    discord: {
        client_id: env.DISCORD_CLIENT_ID,
        discord_bot_token: env.DISCORD_BOT_TOKEN,
        guild: {
            dev: env.DISCORD_DEV_GUILD,
            prod: env.DISCORD_PROD_GUILD,
        },
    },
    database: {
        uri: env.DATABASE_URI,
    },
    riot: {
        dev_key: env.RIOT_DEV_KEY,
    },
    sepay: {
        api_key: env.SEPAY_API_KEY,
    },
};

module.exports = Configs;
