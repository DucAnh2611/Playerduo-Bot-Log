const { SlashCommandBuilder } = require("discord.js");
const BANKS_LIST = require("../../../const/bank");

const DiscordCommandPlayduo = new SlashCommandBuilder()
    .setName("playduo")
    .setDescription("Cập nhật thông tin playerduo")
    .addUserOption((option) =>
        option.setName("player").setDescription("Chọn player").setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName("ngan-hang")
            .setDescription("Ngân hàng")
            .setRequired(false)
            .setAutocomplete(true)
    )
    .addStringOption((option) =>
        option
            .setName("so-tai-khoan")
            .setDescription("Số tài khoản")
            .setRequired(false)
    )
    .addIntegerOption((option) =>
        option
            .setName("gia-tien")
            .setDescription("Giá tiền (theo giờ)")
            .setRequired(false)
    )
    .addStringOption((option) =>
        option
            .setName("ten-tai-khoan")
            .setDescription("Tên tài khoản (xác thực)")
            .setRequired(false)
    )
    .addStringOption((option) =>
        option
            .setName("link")
            .setDescription("Link playerduo")
            .setRequired(false)
    );

module.exports = DiscordCommandPlayduo;
