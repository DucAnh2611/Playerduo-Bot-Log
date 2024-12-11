const { default: mongoose } = require("mongoose");

const PlayerSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        guildId: { type: String, required: true },
        link: { type: String, required: false, default: null },
        bankCode: { type: String, required: true },
        bankNum: { type: String, required: true },
        bankName: { type: String, required: false, default: null },
        price: { type: Number, required: true },
    },
    { timestamps: true }
);

const PlayerModel = mongoose.model("player", PlayerSchema);

module.exports = PlayerModel;
