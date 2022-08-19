const { SlashCommandBuilder } = require("discord.js");

// Discord slash-command that returns API Latency and Client Ping
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Return my ping!"),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true,
        });

        const newMessage = `API Latency ${client.ws.ping}\nClient ping: ${
            message.createdTimestamp - interaction.createdTimestamp
        }`;
        await interaction.editReply({
            content: newMessage,
        });
    },
};
