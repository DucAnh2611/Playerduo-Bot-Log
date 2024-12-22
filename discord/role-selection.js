const { EmbedBuilder } = require("discord.js");

const roleSelection = (client) => {
    client.on("messageCreate", async (message) => {
        if (message.content === "!createRoleReaction") {
            const roleManager = message.guild.roles;
            const rolesCache = roleManager.cache;

            const roles = rolesCache.map((role) => ({
                id: role.id,
                name: role.name,
            }));

            const baseRoles = {
                joined: { name: "Joined", color: 9807270 },
                fen: { name: "Fen", color: 3447003 },
                duo: { name: "Duo", color: 15105570 },
            };

            const isCreated = {
                joined: false,
                fen: false,
                duo: false,
            };

            const baseEntries = Object.entries(baseRoles);

            roles.forEach((role) => {
                const found = baseEntries.find((i) => i[1].name === role.name);
                if (found && !isCreated[found[0]]) {
                    isCreated[found[0]] = true;
                }
            });

            const isNotCreated = Object.entries(isCreated).filter((e) => !e[1]);

            if (isNotCreated.length > 0) {
                isNotCreated.forEach(([role]) => {
                    roleManager
                        .create({
                            name: baseRoles[role].name,
                            permissions: [],
                            color: baseRoles[role].color,
                            hoist: true,
                            mentionable: true,
                        })
                        .catch(console.log);
                });
            }

            const embed = new EmbedBuilder()
                .setColor("#0099ff")
                .setTitle("Chọn chức vụ")
                .setDescription("Thả biểu tượng cảm xúc bên dưới để chọn role!")
                .addFields(
                    {
                        name: "🎮 Duo",
                        value: "Sau khi chọn, nếu có thông tin chuyển khoản vui lòng nhập thông tin bằng lệnh /player.",
                    },
                    {
                        name: "😼 Fen",
                        value: "Chỉ là bạn bè thông thường.",
                    }
                )
                .setFooter({ text: "Thả biểu tượng để chọn quyền!" });

            const roleMessage = await message.channel.send({
                embeds: [embed],
            });

            await roleMessage.react("🎮");
            await roleMessage.react("😼");
        }
    });

    client.on("messageReactionAdd", async (reaction, user) => {
        if (user.bot) return;
        await reaction.fetch();

        const message = reaction.message;
        const guild = message.guild;
        const member = await guild.members.fetch(user.id);
        const roles = guild.roles.cache;

        if (
            message.embeds.length > 0 &&
            message.embeds[0].title === "Chọn chức vụ"
        ) {
            let name = "";

            switch (reaction.emoji.name) {
                case "🎮":
                    name = "Duo";
                    break;

                case "😼":
                    name = "Fen";
                    break;

                default:
                    break;
            }

            let roleId = null;
            if (name) {
                roleId = roles.find((i) => i.name === name)?.id;
            }

            if (roleId) {
                try {
                    const role = guild.roles.cache.get(roleId);
                    if (role) {
                        await member.roles.add(role);
                        console.log(
                            `${user.tag} has been assigned the ${role.name} role.`
                        );
                    }
                } catch (error) {
                    console.error("Error assigning role:", error);
                }
            }
        }
    });

    client.on("messageReactionRemove", async (reaction, user) => {
        if (user.bot) return;
        await reaction.fetch();

        const message = reaction.message;
        const guild = message.guild;
        const member = await guild.members.fetch(user.id);
        const roles = guild.roles.cache;

        if (
            message.embeds.length > 0 &&
            message.embeds[0].title === "Chọn chức vụ"
        ) {
            let name = "";

            switch (reaction.emoji.name) {
                case "🎮":
                    name = "Duo";
                    break;

                case "😼":
                    name = "Fen";
                    break;

                default:
                    break;
            }

            let roleId = null;
            if (name) {
                roleId = roles.find((i) => i.name === name)?.id;
            }

            if (roleId) {
                try {
                    const role = guild.roles.cache.get(roleId);
                    if (role) {
                        await member.roles.remove(role);
                        console.log(
                            `${user.tag} has had the ${role.name} role removed.`
                        );
                    }
                } catch (error) {
                    console.error("Error removing role:", error);
                }
            }
        }
    });
};

module.exports = roleSelection;
