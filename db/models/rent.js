const { default: mongoose } = require("mongoose");
const convertTime = require("../../util/time");

const RentSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: "player" },
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: "transaction" },

    duration: { type: Number, required: true },
    price: { type: Number, required: true },

    sentNoti: { type: Boolean, required: false, default: false },
    status: { type: String, required: false, default: false },
    start: { type: Date, require: false, default: null },
    end: { type: Date, required: false, default: null },
});

RentSchema.pre("save", function () {
    const start = new Date();
    this.start = start;
    this.status = "RENTING";
    this.sentNoti = false;

    this.end = convertTime(start, this.duration);
});

const RentModel = mongoose.model("rent", RentSchema);

module.exports = RentModel;
