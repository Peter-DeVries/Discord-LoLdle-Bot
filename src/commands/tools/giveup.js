const { SlashCommandBuilder } = require("discord.js");

// Slash command that ends current game and reveals answer
module.exports = {
    data: new SlashCommandBuilder()
        .setName("giveup")
        .setDescription("Giveup the Loldle and get the answer!"),
    async execute(interaction, client) {
        // Need null check for game not started
        if (!client.currentGame[interaction.user.tag]) {
            let deleteMessage = await interaction.reply({
                content:
                    "You must start a game before you can giveup! The command is: /loldle",
                fetchReply: true,
            });
            if (deleteMessage) {
                setTimeout(() => deleteMessage.delete(), 3000);
            }
            return;
        }
        // Returns the amount of guess and answers
        let newMessage = `You gave up after ${
            client.currentGame[interaction.user.tag].guessAmount
        } guesses! The correct answer was: ${
            client.currentGame[interaction.user.tag].answer
        }\n`;
        // The following string it really long but needed for line formatting
        for (let guess of client.currentGame[interaction.user.tag].guesses) {
            newMessage += `${guess.gender.color}${guess.positions.color}${guess.species.color}${guess.resource.color}${guess.range_type.color}${guess.regions.color}${guess.release_year.color}\n`;
        }
        await interaction.reply(newMessage);
        // Deletes all previous messages to prevent chat clutter
        for (let messageToDelete of client.currentGame[interaction.user.tag]
            .previousMessages) {
            messageToDelete.delete();
        }
        // Removes existing game memory
        client.currentGame[interaction.user.tag] = null;
    },
};
