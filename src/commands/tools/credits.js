const { SlashCommandBuilder } = require("discord.js");

// Discord slash-command that returns credits
module.exports = {
    data: new SlashCommandBuilder()
        .setName("credits")
        .setDescription("Shows credits"),
    async execute(interaction, client) {
        await interaction.reply(`
            Original idea for the game originally by: Pimeko (loldle.net)\nDiscord Bot created by: Peter D. (Fluffley)`);
    },
};
