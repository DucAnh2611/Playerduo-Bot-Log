async function commandStatisticHanlder(interaction) {
    const { options } = interaction;
    if (!interaction.isCommand()) {
        return;
    }

    const selections = {
        player: options.getUser("player"),
    };

    const targetMember = interaction.guild.members.cache.find(
        (i) => i.id === selections.player.id
    );
    const requestMember = interaction.member;

    if (selections.player.bot) {
        await interaction.reply(
            `${
                targetUser.nickname ||
                targetUser.user.globalName ||
                targetUser.user.username
            } là Bot!`
        );
        return;
    }

    const memberRoles = targetMember.roles.cache.map((e) => ({
        id: e.id,
        name: e.name,
    }));

    if (!memberRoles.find((i) => i.name === "Duo")) {
        await interaction.reply(
            `${
                targetMember.nickname ||
                targetMember.user.globalName ||
                targetMember.user.username
            } Hiện tại không phải Playerduo!`
        );
        return;
    }

    const isSameUser = requestUser.user.id === targetMember.user.id;
    const fields = {
        rent: 0,
        spends: 0,
    };

    console.log(targetUser);
}

module.exports = commandStatisticHanlder;
