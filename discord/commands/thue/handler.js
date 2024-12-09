const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const PlayerModel = require("../../../db/models/player");
const TransactionModel = require("../../../db/models/transactions");

const commandRentHandler = async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const { commandName, options } = interaction;

    const selections = {
        player: options.getUser("player"),
        duration: options.getInteger("thoi-gian"),
        price: options.getInteger("so-tien"),
    };

    const getMember = interaction.guild.members.cache.find(
        (i) => i.id === selections.player.id
    );
    const memberRoles = getMember.roles.cache.map((i) => ({
        id: i.id,
        name: i.name,
    }));

    if (getMember.user.id === interaction.user.id) {
        await interaction.reply(`Không thể thuê chính mình!`);
        return;
    }

    if (!memberRoles.find((i) => i.name === "Duo")) {
        await interaction.reply(
            `${
                getMember.nickname ||
                getMember.user.globalName ||
                getMember.user.username
            } không phải là player của playerduo!`
        );
        return;
    }

    const searchPlayer = await PlayerModel.findOne({ id: getMember.user.id });
    if (!searchPlayer) {
        await interaction.reply(
            `${
                getMember.nickname ||
                getMember.user.globalName ||
                getMember.user.username
            } chưa cập nhật thông tin, gợi ý: /playerduo!`
        );
        return;
    }

    const playerData = searchPlayer.toObject();

    const userAvatarURL = getMember.displayAvatarURL({
        dynamic: true,
        size: 1024,
    });

    const playerName =
        getMember.nickname ||
        getMember.user.globalName ||
        getMember.user.username;
    const price = selections.price ? selections.price : playerData.price;

    const transactionInstance = new TransactionModel({
        player: playerData._id,
        snapshot: {
            duration: selections.duration,
            price: price,
        },
        total: selections.duration * price,
    });

    const transactionSaved = await transactionInstance.save();

    await TransactionModel.updateOne(
        { _id: transactionSaved._id },
        {
            paymentLink: `https://qr.sepay.vn/img?acc=${
                playerData.bankNum
            }&bank=${playerData.bankCode}&amount=${
                selections.duration * price
            }&des=PD${transactionSaved.code}&template=compact`,
        }
    );

    const cardId = transactionSaved.code;

    const embed = new EmbedBuilder()
        .setColor("Purple")
        .setTitle("Xác nhận thuê " + playerName)
        .setDescription(`Code: ${cardId}`)
        .setThumbnail(userAvatarURL)
        .addFields([
            {
                name: "Thời gian thuê",
                value: `${selections.duration} giờ`,
                inline: true,
            },
            {
                name: "Tên",
                value: playerName,
                inline: true,
            },
            {
                name: "Giá tiền",
                value: `${price.toLocaleString("vi", {
                    currency: "VND",
                    style: "currency",
                })} / Giờ`,
                inline: true,
            },
            {
                name: "Tổng",
                value: `${(selections.duration * price).toLocaleString("vi", {
                    currency: "VND",
                    style: "currency",
                })}`,
                inline: true,
            },
        ])
        .setFooter({
            text: "Xác nhận bằng cách ấn nút bên dưới để hiện mã chuyển tiền ngân hàng!",
        });

    const confirmBtn = new ButtonBuilder()
        .setCustomId(`cf_rent_btn-${cardId}`)
        .setLabel("Xác nhận")
        .setStyle(ButtonStyle.Success);

    const cancelBtn = new ButtonBuilder()
        .setCustomId(`cancel_rent_btn-${cardId}`)
        .setLabel("Hủy")
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
        .addComponents(cancelBtn)
        .addComponents(confirmBtn);

    await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true,
    });
};

module.exports = commandRentHandler;