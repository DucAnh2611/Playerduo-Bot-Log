const { default: mongoose } = require("mongoose");
const Configs = require("../configs");

const InitDatabase = async () => {
    try {
        const conn = await mongoose.connect(Configs.database.uri);
        console.log("Connected to database!");
    } catch (err) {
        console.log("Init database failed: ", err);
    }
};

module.exports = InitDatabase;
