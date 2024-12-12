const { CronJob } = require("cron");
const { getClientDiscord } = require("../discord");
const RentModel = require("../db/models/rent");
const { PermissionFlagsBits, ChannelType } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const convertTime = require("../util/time");

const rentingJob = new CronJob("* * * * *", async function () {
    const client = getClientDiscord();
    if (!client) return;

    const getIsRenting = await RentModel.find({
        status: "RENTING",
        end: { $gte: new Date() },
        sentNoti: false,
    })
        .populate("player")
        .populate("transaction");
    if (!getIsRenting.length) return;

    console.log(`Renting found:`, getIsRenting.length);

    const guildIds = getIsRenting.reduce((acc, curr) => {
        const guildId = curr.player.guildId;
        if (!acc.includes(guildId)) {
            acc.push(guildId);
        }
        return acc;
    }, []);

    const getGuilds = {};
    for (const guildId of guildIds) {
        if (!getGuilds[guildId]) {
            getGuilds[guildId] = await client.guilds.fetch(guildId);
        }
    }

    await Promise.all(
        getIsRenting.map(async (rent) => {
            const { player, transaction } = rent;

            const guild = getGuilds[player.guildId];
            if (!guild) return null;

            const channelName = `thong-bao-thue-${player.userId}`;

            const channels = guild.channels.cache;
            const findNotificationChanel = channels.find(
                (i) => i.name === channelName
            );
            if (!findNotificationChanel) {
                await guild.members.fetch();
                await guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: player.userId,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory,
                            ],
                        },
                        {
                            id: transaction.rentBy,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory,
                            ],
                        },
                    ],
                });
            }

            const channelNoti = guild.channels.cache.find(
                (ch) => ch.name === channelName
            );
            if (!channelNoti) return null;

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Yêu cầu thuê đã hết thời gian")
                .addFields([
                    {
                        name: "Thời gian thuê",
                        value: convertTime(rent.start, 7).toLocaleString(),
                    },
                    {
                        name: "Thời gian kết thúc",
                        value: convertTime(rent.end, 7).toLocaleString(),
                    },
                    { name: "Số giờ", value: rent.duration.toString() },
                    {
                        name: "Giá tiền",
                        value: rent.price.toLocaleString("vi", {
                            style: "currency",
                            currency: "VND",
                        }),
                    },
                    {
                        name: "Link Playerduo",
                        value: player.link || "Chưa cung cấp!",
                    },
                ])
                .setFooter({
                    text: "Chúc cậu có một trải nghiệm vui vẻ! Love ya <3",
                });

            await RentModel.updateOne(
                {
                    _id: rent._id,
                },
                { status: "ENDED", sendNoti: true }
            );

            channelNoti.send({
                embeds: [embed],
                content: `<@${rent.transaction.rentBy.id}> ơi, yêu cầu thuê có mã số ${transaction.code} của cậu với <@${rent.player.id}> đã kết thúc!`,
            });
        })
    ).catch((e) => console.log(e));
});

module.exports = rentingJob;
