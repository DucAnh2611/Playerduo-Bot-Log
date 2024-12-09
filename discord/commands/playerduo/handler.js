const e = require("cors");
const BANKS_LIST = require("../../../const/bank");
const PlayerModel = require("../../../db/models/player");

async function commandPlayduoHandler(interaction) {
    const { options } = interaction;
    if (!interaction.isCommand()) {
        if (
            options.getFocused(true).name === "ngan-hang" &&
            interaction.isAutocomplete()
        ) {
            const focusedValue = interaction.options.getFocused();
            const filteredBanks = BANKS_LIST.filter(
                (bank) =>
                    bank.name
                        .toLowerCase()
                        .includes(focusedValue.toLowerCase()) ||
                    bank.shortName
                        .toLowerCase()
                        .includes(focusedValue.toLowerCase()) ||
                    bank.code.toLowerCase().includes(focusedValue.toLowerCase())
            );

            const choices = filteredBanks.slice(0, 5).map((bank) => ({
                name: `(${bank.code}) - ${bank.name}`,
                value: bank.shortName,
            }));

            await interaction.respond(choices);
        }
        return;
    }

    const selections = {
        player: options.getUser("player"),
        bankCode: options.getString("ngan-hang"),
        bankNum: options.getString("so-tai-khoan"),
        bankName: options.getString("ten-tai-khoan") || null,
        price: options.getInteger("gia-tien"),
        link: options.getString("link") || null,
    };

    const getMember = interaction.guild.members.cache.find(
        (i) => i.id === selections.player.id
    );

    if (selections.player.bot) {
        await interaction.reply(
            `${
                getMember.nickname ||
                getMember.user.globalName ||
                getMember.user.username
            } là Bot!`
        );
        return;
    }
    const memberRoles = getMember.roles.cache.map((e) => ({
        id: e.id,
        name: e.name,
    }));

    if (memberRoles.find((i) => e.name === "Duo")) {
        await interaction.reply(
            `${
                getMember.nickname ||
                getMember.user.globalName ||
                getMember.user.username
            } Hiện tại không phải Playerduo!`
        );
        return;
    }

    let player = await PlayerModel.findOne({ id: getMember.user.id });
    const body = {
        id: getMember.user.id,
        link: selections.link,
        bankCode: selections.bankCode,
        bankNum: selections.bankNum,
        bankName: selections.bankName,
        price: selections.price,
    };
    if (!player) {
        const playerInstance = new PlayerModel(body);
        await playerInstance.save();
    } else {
        const { _id, ...dataP } = player.toObject();

        await PlayerModel.updateOne(
            { id: getMember.user.id },
            {
                ...dataP,
                ...body,
            }
        );
    }

    await interaction.reply(
        `Đã lưu thông tin ${
            getMember.nickname ||
            getMember.user.globalName ||
            getMember.user.username
        }!`
    );
}

module.exports = commandPlayduoHandler;
