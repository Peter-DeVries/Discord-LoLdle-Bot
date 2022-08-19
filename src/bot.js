require("dotenv").config();
const keepAlive = require("./server");
const { token } = process.env;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({ intents: GatewayIntentBits.Guilds });
client.commands = new Collection();
client.commandArray = [];
client.championList = require(`../championData.json`);
client.championNames = [];
client.currentGame = {
    // Map where user tag clientId points to { answer: guessAmount: }
};

// Initalizes list of champion names
for (const champion of client.championList) {
    client.championNames.push(champion.championName.toLowerCase());
}

// Bot setup and handlers below
const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`./src/functions/${folder}`)
        .filter((file) => file.endsWith(".js"));
    for (const file of functionFiles)
        require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.login(token);
keepAlive();