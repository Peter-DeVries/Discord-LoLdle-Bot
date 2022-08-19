// This file is used to keep the bot running 24/7
const express = require("express");
const server = express();

server.all("/", (req, res) => {
    res.send(`Result: [OK].`);
});

function keepAlive() {
    server.listen(3000, () => {
        console.log(`Server is now ready! | ` + Date.now());
    });
}

module.exports = keepAlive;
