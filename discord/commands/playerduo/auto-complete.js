const BANKS_LIST = require("../../../const/bank");

const commandPlayerDuoAutoCompleteHandler = async (interaction) => {
    const { options } = interaction;
    const option = options.getFocused(true).name;

    switch (option) {
        case "ngan-hang":
            const focusedValue = interaction.options.getFocused();
            const filteredBanks = BANKS_LIST.filter(
                (bank) =>
                    bank.name
                        .toLowerCase()
                        .includes(focusedValue.toLowerCase()) ||
                    bank.shortName
                        .toLowerCase()
                        .includes(focusedValue.toLowerCase()) ||
                    bank.code
                        .toLowerCase()
                        .includes(focusedValue.toLowerCase()) ||
                    `(${bank.code}) - ${bank.name}`
                        .toLowerCase()
                        .includes(focusedValue.toLowerCase())
            );

            const choices = filteredBanks.slice(0, 5).map((bank) => ({
                name: `(${bank.code}) - ${bank.name}`,
                value: bank.shortName,
            }));

            await interaction.respond(choices);
            return;

        default:
            return;
    }
};

module.exports = commandPlayerDuoAutoCompleteHandler;
