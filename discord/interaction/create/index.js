const { ButtonBuilder, EmbedBuilder } = require("discord.js");
const DISCORD_CONSTANTS = require("../../constants");
const TransactionModel = require("../../../db/models/transactions");
const commandPlayduoHandler = require("../../commands/playerduo/handler");
const commandRentHandler = require("../../commands/thue/handler");
const commandStatisticHanlder = require("../../commands/thong-ke/handler");

async function interactionCreateHandler(interaction) {
    const { commandName, customId } = interaction;

    if (interaction.isButton()) {
        const [action, ...cardIds] = customId.split("-");

        const cardId = cardIds.join("-");
        try {
            const checkTransaction = await TransactionModel.findOne({
                code: cardId,
                status: "PENDING",
                expiredAt: {
                    $gte: new Date(),
                },
            });
            if (!checkTransaction) {
                interaction.reply({
                    content: `Giao dịch không hợp lệ!`,
                    ephemeral: true,
                });
                return;
            }

            const transaction = checkTransaction.toObject();

            if (action === "cancel_rent_btn") {
                interaction.reply({
                    content: `Bạn đã hủy bỏ yêu cầu mã: ${cardId}`,
                    ephemeral: true,
                });

                await TransactionModel.updateOne(
                    { code: cardId },
                    { status: "CANCELLED" }
                );
            } else if (action === "cf_rent_btn") {
                const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("Chuyển khoản")
                    .setImage(transaction.paymentLink)
                    .setFooter({ text: "Vui lòng quét mã để thanh toán!" });

                interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }
        } catch (err) {
            console.log(err);
        }

        return;
    }

    switch (commandName) {
        case "thue":
            await commandRentHandler(interaction);
            return;

        case "playduo":
            await commandPlayduoHandler(interaction);
            return;

        case "thong-ke":
            await commandStatisticHanlder(interaction);
            return;

        default:
            await interaction.reply(
                "Tớ đang code, chưa có chức năng gì hết hehe!"
            );
            return;
    }
}

module.exports = interactionCreateHandler;
