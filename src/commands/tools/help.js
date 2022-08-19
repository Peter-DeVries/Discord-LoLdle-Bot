const { SlashCommandBuilder } = require("discord.js");

// Discord slash-command that returns says all possible commands
module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Explains all of my commands!"),
    async execute(interaction, client) {
        await interaction.reply(`
        Here's a list and explaination of all my functions!:
        /LoLdle - Starts a game of LoLdle
        /guess <champion name> - Places a guess in the LoLdle game
        /giveup - Ends the current LoLdle game
        /ping - Shows API Latency and Client Ping
        /credits - Shows credits for the bot and game
        /help - List of all possible commands
        `);
    },
};
