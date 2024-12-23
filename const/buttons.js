const BUTTON_RENTING_CARD = {
    confirm: {
        format: "<ACTION>-<ID>",
        action: "cf_rent_btn",
        getId: (id) =>
            BUTTON_RENTING_CARD.confirm.format
                .replace("<ID>", id)
                .replace("<ACTION>", BUTTON_RENTING_CARD.confirm.action),
    },
    cancel: {
        format: "<ACTION>-<ID>",
        action: "cancel_rent_btn",
        getId: (id) =>
            BUTTON_RENTING_CARD.cancel.format
                .replace("<ID>", id)
                .replace("<ACTION>", BUTTON_RENTING_CARD.cancel.action),
    },
    getIdFormated: (type, action, id) =>
        BUTTON_RENTING_CARD[type].format
            .replace("<ID>", id)
            .replace("<ACTION>", action),
};

const BUTTON_START_COUNT_TIME = {
    start: {
        format: "<ACTION>-<ID>",
        action: "start_rent",
        getId: (id) =>
            BUTTON_START_COUNT_TIME.start.format
                .replace("<ID>", id)
                .replace("<ACTION>", BUTTON_START_COUNT_TIME.start.action),
    },
    getIdFormated: (type, action, id) =>
        BUTTON_START_COUNT_TIME[type].format
            .replace("<ID>", id)
            .replace("<ACTION>", action),
};

module.exports = {
    BUTTON_RENTING_CARD,
    BUTTON_START_COUNT_TIME,
};
