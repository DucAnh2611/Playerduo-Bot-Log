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
                    bank.code
                        .toLowerCase()
                        .includes(focusedValue.toLowerCase()) ||
                    `(${bank.code}) - ${bank.name}`
                        .toLowerCase()
                        .includes(focusedValue.toLowerCase())
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

    if (!memberRoles.find((i) => i.name === "Duo")) {
        await interaction.reply(
            `${
                getMember.nickname ||
                getMember.user.globalName ||
                getMember.user.username
            } Hiện tại không phải Playerduo!`
        );
        return;
    }

    const fields = [
        {
            name: "ngan-hang",
            get: "getString",
            dbFieldName: "bankCode",
            required: true,
        },
        {
            name: "so-tai-khoan",
            get: "getString",
            dbFieldName: "bankNum",
            required: true,
        },
        {
            name: "gia-tien",
            get: "getInteger",
            dbFieldName: "price",
            required: true,
        },

        {
            name: "ten-tai-khoan",
            get: "getString",
            dbFieldName: "bankName",
            required: false,
        },
        {
            name: "link",
            get: "getString",
            dbFieldName: "link",
            required: false,
        },
    ];

    const newData = {};
    fields.forEach((field) => {
        const fieldValue = options[field.get](field.name);
        if (fieldValue) {
            newData[field.dbFieldName] = fieldValue;
        }
    });

    if (selections.bankCode) {
        const getBank = BANKS_LIST.find((bank) =>
            [`(${bank.code}) - ${bank.name}`, bank.shortName].includes(
                selections.bankCode
            )
        );
        if (!getBank) {
            await interaction.reply(
                `Thông tin ngan-hang bị sai, vui lòng chọn lại`
            );
            return;
        }
        selections.bankCode = getBank.shortName;
    }

    const body = {
        userId: getMember.user.id,
        guildId: interaction.guildId,
        ...newData,
    };

    let player = await PlayerModel.findOne({
        userId: getMember.user.id,
        guildId: interaction.guildId,
    });
    if (!player) {
        const requiredFields = fields.filter((i) => i.required);

        for (const field of requiredFields) {
            const fieldValue = selections[field.dbFieldName];
            if (!fieldValue) {
                await interaction.reply(`Yêu cầu nhập trường ${field.name}`);
                return;
            }
        }

        const playerInstance = new PlayerModel(body);
        await playerInstance.save();
    } else {
        await PlayerModel.updateOne(
            { _id: player._id },
            {
                ...newData,
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
