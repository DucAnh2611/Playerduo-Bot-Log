const { CronJob } = require("cron");
const { getClientDiscord } = require("../discord");
const RentModel = require("../db/models/rent");
const PlayerModel = require("../db/models/player");

const rentingJob = new CronJob("0 * * ? * *", async function () {
    // const clientDiscord = getClientDiscord();
    // if (!clientDiscord) return;
    // const getIsRenting = await RentModel.find({
    //     status: "RENTING",
    //     end: { $gte: new Date() },
    // })
    //     .populate("player")
    //     .populate("transaction");
    // if (!getIsRenting.length) return;
    // const guild = await clientDiscord.guilds.fetch()
    // const updateAllEnded = await RentModel.updateMany(
    //     {
    //         _id: { $in: getIsRenting.map((i) => i._id) },
    //     },
    //     { status: "ENDED" }
    // );
    // const sendNotification = getIsRenting.map((rent) => {
    //     clientDiscord;
    // });
});

module.exports = rentingJob;
