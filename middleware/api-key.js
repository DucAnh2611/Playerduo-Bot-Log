const CheckApiKey = (key) =>
    function (req, res, next) {
        const headers = req.headers;

        const { authorization } = headers;
        if (!authorization) {
            return res
                .status(404)
                .json({ ok: false, message: "Missing apikey" });
        }

        const [type, apiKey] = authorization.split(" ");
        if (apiKey !== key) {
            return res
                .status(401)
                .json({ ok: false, message: "Api key wrong" });
        }

        next();
    };

module.exports = CheckApiKey;
