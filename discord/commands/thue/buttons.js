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
const PlayerModel = require("../../../db/models/player");
const convertTime = require("../../../util/time");

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
        if (action === BUTTON_RENTING_CARD.cancel.action) {
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
            const transactionData = checkTransaction.toObject();

            const rentInstance = new RentModel({
                player: transactionData.player,
                transaction: transactionData._id,

                duration: transactionData.snapshot.duration,
                price: transactionData.snapshot.price,
            });

            const rentSaved = await rentInstance.save();

            const startTime = convertTime(
                new Date(rentSaved.start),
                7
            ).toLocaleString("vi");
            const endTime = convertTime(
                new Date(rentSaved.end),
                7
            ).toLocaleString("vi");

            const buttonStatus = new ButtonBuilder()
                .setCustomId(`button_counted-${transactionData.code}`)
                .setStyle(ButtonStyle.Success)
                .setDisabled(true)
                .setLabel(`Bắt đầu lúc ${startTime}`);

            const row = new ActionRowBuilder().addComponents(buttonStatus);

            const message = await interaction.message;
            await message.edit({ components: [row] });

            await Promise.all([
                interaction.reply(
                    `Bắt đầu tính giờ yêu cầu: \`${transactionCode}\` lúc \`${startTime}\` dự kiến kết thúc \`${endTime}\``
                ),
                PlayerModel.updateOne(
                    {
                        _id: transactionData.player,
                    },
                    {
                        isRenting: true,
                    }
                ),
            ]);
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
