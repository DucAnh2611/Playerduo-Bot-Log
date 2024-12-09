const express = require("express");
const Configs = require("../configs");
const cors = require("cors");
const bodyParser = require("body-parser");
const SepayRoutes = require("./routes/sepay");

function InitApp() {
    const app = express();

    app.use(
        cors({
            origin: "*",
        })
    );
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use("/sepay", SepayRoutes);
    app.get("/restart", (req, res) => {
        return res.json({ start: true });
    });

    app.listen(Configs.app.port, () => {
        console.log("listening to port:", Configs.app.port);
    });
}

module.exports = InitApp;
