const { EmbedBuilder } = require("discord.js");
const TransactionModel = require("../../../db/models/transactions");
const { BUTTON_RENTING_CARD } = require("../../../const/buttons");

const isRentingButton = (interaction) => {
    const { customId } = interaction;
    const [action, ...cardIds] = customId.split("-");

    if (!action || !cardIds || (cardIds && !cardIds.length)) return false;

    const cardId = cardIds.join("-");
    const buttonTypes = Object.keys(BUTTON_RENTING_CARD);

    for (const type of buttonTypes) {
        if (
            BUTTON_RENTING_CARD[type] &&
            BUTTON_RENTING_CARD[type].getId(cardId) ===
                BUTTON_RENTING_CARD.getIdFormated(type, action, cardId)
        ) {
            return true;
        }
    }

    return false;
};

const commandRentButtonHandler = async (interaction) => {
    const { customId } = interaction;
    const [action, ...cardIds] = customId.split("-");
    const transactionCode = cardIds.join("-");

    try {
        const checkTransaction = await TransactionModel.findOne({
            code: transactionCode,
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

        if (action === BUTTON_RENTING_CARD.cancel.action) {
            await TransactionModel.updateOne(
                { code: transactionCode },
                { status: "CANCELLED" }
            );

            const message = await interaction.message;

            await message.edit({ components: [] });
            await interaction.reply({
                content: `Bạn đã hủy bỏ yêu cầu mã: ${transactionCode}`,
                ephemeral: true,
            });
        } else if (action === BUTTON_RENTING_CARD.confirm.action) {
            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Chuyển khoản")
                .setImage(transaction.paymentLink)
                .setFooter({ text: "Vui lòng quét mã để thanh toán!" });

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

const ButtonRentEvent = {
    validation: isRentingButton,
    handler: commandRentButtonHandler,
};

module.exports = ButtonRentEvent;
