const { SlashCommandBuilder } = require("discord.js");

// Slash-Command that starts game of LoLdle -- initalizes game
module.exports = {
    data: new SlashCommandBuilder()
        .setName("loldle")
        .setDescription("Play a game of Loldle! (League of Legends Wordle)"),
    async execute(interaction, client) {
        /**
         * answer: game solution
         * guesses: List of data (colors) of previous guess to show outcome at end of game
         * guessAmount: amount of guesses used
         * previousMessages: List of messages that will be removed when the game ends
         */
        client.currentGame[interaction.user.tag] = {
            answer: client.championNames[
                Math.floor(Math.random() * client.championNames.length)
            ],
            guesses: [],
            guessAmount: 0,
            previousMessages: [],
        };
        let startMessage = await interaction.reply({
            content: "Champion picked, do /guess <Champion Name> to start!",
            fetchReply: true,
        });
        // Adds game to array to be removed at end of game
        client.currentGame[interaction.user.tag].previousMessages.push(
            startMessage
        );
    },
};
