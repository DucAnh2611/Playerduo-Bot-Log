const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const TransactionModel = require("../../../db/models/transactions");
const {
    BUTTON_RENTING_CARD,
    BUTTON_START_COUNT_TIME,
} = require("../../../const/buttons");
const RentModel = require("../../../db/models/rent");

const isRentingButton = (interaction) => {
    const { customId } = interaction;
    const [action, ...cardIds] = customId.split("-");

    if (!action || !cardIds || (cardIds && !cardIds.length)) return false;

    const cardId = cardIds.join("-");
    const buttonsList = [BUTTON_RENTING_CARD, BUTTON_START_COUNT_TIME];

    for (const button of buttonsList) {
        const buttonTypes = Object.keys(button);

        for (const type of buttonTypes) {
            if (
                !!button[type]?.getId &&
                button[type].getId(cardId) ===
                    button.getIdFormated(type, action, cardId)
            ) {
                return true;
            }
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
            status: "PAID",
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

            const buttonStatus = new ButtonBuilder()
                .setCustomId(`button_status-${transaction.code}`)
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true)
                .setLabel("Đã hủy!");

            const row = new ActionRowBuilder().addComponents(buttonStatus);

            const message = await interaction.message;

            await message.edit({ components: [row] });
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

            const buttonStatus = new ButtonBuilder()
                .setCustomId(`button_status-${transaction.code}`)
                .setStyle(ButtonStyle.Success)
                .setDisabled(true)
                .setLabel("Đã xác nhận!");

            const row = new ActionRowBuilder().addComponents(buttonStatus);

            const message = await interaction.message;
            await message.edit({ components: [row] });

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        } else if (action === BUTTON_START_COUNT_TIME.start.action) {
            const transactionData = await TransactionModel.findOne({
                code: transactionCode,
                status: "PENDING",
            }).populate("player");

            const rentInstance = new RentModel({
                player: transactionData.player,
                transaction: transactionData._id,

                duration: transactionData.snapshot.duration,
                price: transactionData.snapshot.price,
            });

            await rentInstance.save();

            await interaction.reply(
                `Bắt đầu tính giờ yêu cầu: \`${transactionCode}\``
            );
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
