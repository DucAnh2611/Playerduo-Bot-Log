const convertTime = (date, time) => {
    const utcDate = new Date(date);

    const offset = time * 60 * 60 * 1000;
    const converted = new Date(utcDate.getTime() + offset);

    return converted;
};

module.exports = convertTime;
