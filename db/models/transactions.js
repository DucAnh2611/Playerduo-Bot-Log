const { default: mongoose } = require("mongoose");
const generateCode = require("../../util/generate-code");

const EXPIRED_MINUTES = 60;

const TransactionSchema = new mongoose.Schema(
    {
        player: { type: mongoose.Schema.Types.ObjectId, ref: "player" },
        rentBy: { type: String, required: true },
        code: { type: String, required: false },
        status: { type: String, default: "PENDING" },
        expiredAt: { type: Date, required: false },
        snapshot: { type: Object, required: true },
        history: [{ type: Object, required: false }],
        total: { type: Number, required: true },
        totalPaid: { type: Number, required: false, default: 0 },
        paymentLink: { type: String, required: false, default: null },
    },
    { timestamps: true }
);

TransactionSchema.pre("save", function () {
    this.code = generateCode(3, "mixed").toUpperCase();
    this.expiredAt = new Date(Date.now() + EXPIRED_MINUTES * 60 * 1000);
    this.status = "PENDING";
});

const TransactionModel = mongoose.model("transaction", TransactionSchema);

module.exports = TransactionModel;
