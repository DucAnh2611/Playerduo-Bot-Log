const generateCode = (length, mode) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const mixed = chars + numbers;

    let charSet;

    switch (mode) {
        case "chars":
            charSet = chars;
            break;
        case "numbers":
            charSet = numbers;
            break;
        case "mixed":
        default:
            charSet = mixed;
            break;
    }

    let code = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        code += charSet[randomIndex];
    }
    const uniqueCode = code + Date.now().toString();

    return uniqueCode;
};

module.exports = generateCode;
