const { EmbedBuilder } = require("discord.js");
const PlayerModel = require("../../../db/models/player");

const commandInfoHandler = async (interaction) => {
    const { options } = interaction;

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

    const player = await PlayerModel.findOne({
        userId: getMember.user.id,
        guildId: interaction.guildId,
    });

    if (!player) {
        await interaction.reply(
            `${
                getMember.nickname ||
                getMember.user.globalName ||
                getMember.user.username
            } Không có thông tin trong cơ sở dữ liệu!`
        );
        return;
    }

    const userAvatarURL = getMember.displayAvatarURL({
        dynamic: true,
        size: 1024,
    });

    const embed = new EmbedBuilder()
        .setColor("Orange")
        .setTitle("Thông tin Duo")
        .setThumbnail(userAvatarURL)
        .setTimestamp(new Date())
        .addFields([
            {
                name: "Tên",
                value: getMember.nickname || getMember.user.username,
            },
            {
                name: "Tài khoản thanh toán",
                value: `[${player.bankCode}] - ${player.bankNum}`,
            },
            {
                name: "Giá",
                value: `${player.price.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                })} / Giờ`,
            },
            {
                name: "Link",
                value: player.link || "Chưa có thông tin!",
            },
        ])
        .setFooter({
            text: "Để cập nhật thông tin nhập /playerduo player thong-tin gia-tri!",
        });

    await interaction.reply({
        embeds: [embed],
        ephemeral: true,
    });
};

module.exports = commandInfoHandler;
