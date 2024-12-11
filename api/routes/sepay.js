const {
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits,
} = require("discord.js");
const Configs = require("../../configs");
const TransactionModel = require("../../db/models/transactions");
const { getClientDiscord } = require("../../discord");
const BANKS_LIST = require("../../const/bank");
const CheckApiKey = require("../../middleware/api-key");
const convertTime = require("../../util/time");

const SepayRoutes = require("express").Router();

SepayRoutes.post(
    "/pay-rent",
    CheckApiKey(Configs.sepay.api_key),
    async (req, res, next) => {
        const body = req.body;
        const { transferAmount, code } = body;

        const transactionCode = code.slice(2, code.length);

        const findTransaction = await TransactionModel.findOne({
            code: transactionCode,
            status: "PENDING",
            expiredAt: {
                $gte: new Date(),
            },
        }).populate("player");
        if (!findTransaction)
            return res
                .status(404)
                .json({ ok: false, message: "No transaction" });

        const transactionData = findTransaction.toObject();
        const { total, totalPaid, history, player } = transactionData;

        const paid = totalPaid + transferAmount;

        await TransactionModel.updateOne(
            { _id: transactionData._id },
            {
                totalPaid: paid,
                history: [...history, body],
                status: total <= paid ? "PAID" : "PENDING",
            }
        );

        const client = getClientDiscord();
        const guild = await client.guilds.fetch(player.guildId);

        const chanels = guild.channels.cache;
        const channelName = `thong-bao-chuyen-tien-${player.userId}`;
        const findNotificationChanel = chanels.find(
            (i) => i.name === channelName
        );

        await guild.members.fetch();
        const getUser = guild.members.cache.find((i) => i.id === player.userId);
        if (!getUser)
            return res
                .status(404)
                .json({ ok: false, message: "No user in guild" });

        if (!findNotificationChanel) {
            await guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: player.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                        ],
                    },
                ],
            });
            console.log(`Channel "${channelName}" created successfully!`);
        }

        const chanelBill = guild.channels.cache.find(
            (ch) => ch.name === channelName
        );
        if (!chanelBill) return res.status(500).json({ ok: false });

        const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("Thông tin chuyển khoản")
            .addFields([
                {
                    name: "Số tiền đã chuyển",
                    value: `${paid.toLocaleString("vi", {
                        currency: "VND",
                        style: "currency",
                    })}/${total.toLocaleString("vi", {
                        currency: "VND",
                        style: "currency",
                    })}`,
                },
                {
                    name: "Ngân hàng nhận",
                    value: BANKS_LIST.find((i) =>
                        [i.shortName, i.short_name].includes(player.bankCode)
                    )?.name,
                },
                {
                    name: "Tài khoản nhận",
                    value: player.bankNum,
                },
                {
                    name: "Thời gian thuê",
                    value: transactionData.snapshot.duration + " Giờ",
                },
                {
                    name: "Giá tiền",
                    value: `${parseInt(
                        transactionData.snapshot.price
                    ).toLocaleString("vi", {
                        currency: "VND",
                        style: "currency",
                    })} / Giờ`,
                },
                {
                    name: "Ngày tạo",
                    value: convertTime(
                        transactionData.createdAt,
                        7
                    ).toLocaleString(),
                },
            ])
            .setFooter({
                text: "Nếu có sai sót cậu báo lại tớ để tớ kiểm tra + back tiền cho cậu!",
            });

        const createHistory = (history, idx) => {
            const bank = BANKS_LIST.find((i) =>
                [i.shortName, i.short_name].includes(history.gateway)
            );

            const historyEmbed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("Thông tin chi tiết " + `(${idx + 1})`)
                .addFields([
                    {
                        name: "Thời gian",
                        value: history.transactionDate,
                    },
                    {
                        name: "Mã tham chiếu",
                        value: history.referenceCode,
                    },
                    {
                        name: "Ngân hàng gửi",
                        value: bank?.name || history.gateway,
                    },
                    {
                        name: "Số tài khoản gửi",
                        value: history.accountNumber,
                    },
                    {
                        name: "Số tiền",
                        value: parseInt(history.transferAmount).toLocaleString(
                            "vi",
                            {
                                currency: "VND",
                                style: "currency",
                            }
                        ),
                    },
                    {
                        name: "Ghi chú",
                        value: history.content,
                    },
                ]);

            if (bank) {
                historyEmbed.setThumbnail(bank.logo);
            }

            return historyEmbed;
        };

        chanelBill.send({
            embeds: [embed, ...[...history, body].map(createHistory)],
            content: `<@${getUser.id}>, tớ đã chuyển khoản cho cậu, nhận được thì báo lại tớ nhé!! <3`,
        });

        return res.json({ ok: true });
    }
);

module.exports = SepayRoutes;
