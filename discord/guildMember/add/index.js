const guildMemberAddHandler = async (member) => {
    const roleManager = member.guild.roles;
    const rolesCache = roleManager.cache;

    const roles = rolesCache.map((role) => ({ id: role.id, name: role.name }));

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

    const role = roleManager.cache.find(
        (i) => i.name === baseRoles.joined.name
    );

    try {
        await member.roles.add(role);
        console.log(
            `Assigned the role "${baseRoles.joined.name}" to ${member.user.tag}`
        );
    } catch (err) {
        console.error(err);
    }
};

module.exports = guildMemberAddHandler;
