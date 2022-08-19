const { SlashCommandBuilder } = require("discord.js");

// Slash-command to guess target champion
module.exports = {
    data: new SlashCommandBuilder()
        .setName("guess")
        .setDescription("Loldle - Guess a champion")
        .addStringOption((option) =>
            option
                .setName("champion")
                .setDescription("Enter a champion")
                .setRequired(true)
                .setAutocomplete(true)
        ),
    // autocomplete function which lists all champions to help with hard to spell names
    async autocomplete(interaction, client) {
        const focusedValue = interaction.options.getFocused();
        const choices = client.championNames;
        const filtered = choices.filter((choice) =>
            choice.startsWith(focusedValue)
        );
        await interaction.respond(
            filtered.map((choice) => ({ name: choice, value: choice }))
        );
    },
    async execute(interaction, client) {
        // Need null check for game not started
        if (
            !client.currentGame[interaction.user.tag] &&
            client.currentGame[interaction.user.tag] !== {}
        ) {
            let deleteMessage = await interaction.reply({
                content: "You must start a game before you can guess! The command is: /loldle",
                fetchReply: true,
            });
            if (deleteMessage) {
                setTimeout(() => deleteMessage.delete(), 3000);
            }
            return;
        } else if (
            validateChampionName(
                interaction.options.getString("champion"),
                client
            )
        ) {
            client.currentGame[interaction.user.tag].guessAmount++;
            // Compares guess champion's data to the target champion's data
            let comparisonData = compareChampions(
                interaction.options.getString("champion"),
                client.currentGame[interaction.user.tag].answer,
                client
            );
            // Stores the data to show at end of game
            client.currentGame[interaction.user.tag].guesses.push(comparisonData);
            // Creates a message to show comparison date
            let newMessage = `Champion: ${interaction.options.getString(
                "champion"
            )}\nGender: ${comparisonData.gender.color}: ${
                comparisonData.gender.value
            }\nPosition(s): ${comparisonData.positions.color}: ${
                comparisonData.positions.value
            }\nSpecies: ${comparisonData.species.color}: ${
                comparisonData.species.value
            }\nResource: ${comparisonData.resource.color}: ${
                comparisonData.resource.value
            }\nRange type: ${comparisonData.range_type.color}: ${
                comparisonData.range_type.value
            }\nRegion(s): ${comparisonData.regions.color}: ${
                comparisonData.regions.value
            }\nRelease year: ${comparisonData.release_year.color}: ${
                comparisonData.release_year.value
            }\n`;
            if (
                guessIsCorrect(
                    interaction.options.getString("champion"),
                    client.currentGame[interaction.user.tag].answer
                )
            ) { // Runs if the target champion name is entered
                newMessage += `You found the LoLdle champion in ${
                    client.currentGame[interaction.user.tag].guessAmount
                } shots! :crossed_swords:\n`;
                // Prints out the previous guesses to show the game's progression
                for (let guess of client.currentGame[interaction.user.tag].guesses) {
                    newMessage += `${guess.gender.color}${guess.positions.color}${guess.species.color}${guess.resource.color}${guess.range_type.color}${guess.regions.color}${guess.release_year.color}\n`;
                }
                await interaction.reply(newMessage);
                // Deletes previous messages
                for (let messageToDelete of client.currentGame[interaction.user.tag].previousMessages) {
                    messageToDelete.delete();
                }
                // Removes the game's memory
                client.currentGame[interaction.user.tag] = null;
            } else {
                // Prints comparison
                const sentMessage = await interaction.reply({
                    content: newMessage,
                    fetchReply: true,
                });
                // Saves message to be removed after game ends
                client.currentGame[interaction.user.tag].previousMessages.push(
                    sentMessage
                );
            }
        } else {
            // Prints if a not valid champion name is entered
            let warningToDelete = await interaction.reply({
                content: `${interaction.options.getString(
                    "champion"
                )} is not a valid champion name! Please enter a valid champion.`,
                fetchReply: true,
            });
            if (warningToDelete) {
                setTimeout(() => warningToDelete.delete(), 3000);
            }
        }
    },
};

// Checks if name entered is actually a champion
function validateChampionName(championName, client) {
    return client.championNames.includes(championName.toLowerCase());
}

// Checks if the champion entered is the targeted champion
function guessIsCorrect(guess, answer) {
    return guess.toLowerCase() === answer.toLowerCase();
}

// Function that compares the guess and answer champions data
function compareChampions(guess, answer, client) {
    let guessData = {};
    let answerData = {};
    let comparison = {
        gender: {
            value: [""],
            color: "",
        },
        positions: {
            value: [""],
            color: "",
        },
        species: {
            value: [""],
            color: "",
        },
        resource: {
            value: [""],
            color: "",
        },
        range_type: {
            value: [""],
            color: "",
        },
        regions: {
            value: [""],
            color: "",
        },
        release_year: {
            value: [""],
            color: "",
        },
    };

    // Sets guessData and answerData to that champion's data
    guessData = getChampionData(guess, client);
    answerData = getChampionData(answer, client);

    // Sets data for data with a single value (excluding dates)
    for (const singleValue of ["gender", "resource"]) {
        comparison[singleValue].value = guessData[singleValue];
        if (guessData[singleValue] === answerData[singleValue]) {
            comparison[singleValue].color = ":green_square:";
        } else {
            comparison[singleValue].color = ":red_square:";
        }
    }

    // Sets data for data with a multiple values (lists)
    for (const listValue of ["positions", "species", "range_type", "regions"]) {
        comparison[listValue].value = guessData[listValue];
        if (JSON.stringify(guessData[listValue]) == JSON.stringify(answerData[listValue])) {
            comparison[listValue].color = ":green_square:";
        } else {
            for (const position of guessData[listValue]) {
                if (answerData[listValue].includes(position)) {
                    comparison[listValue].color = ":orange_square:";
                }
            }
        }
        if (comparison[listValue].color === "") {
            comparison[listValue].color = ":red_square:";
        }
    }

    // Sets data for dates
    let guessYear = new Date(guessData.release_date).getFullYear();
    let answerYear = new Date(answerData.release_date).getFullYear();
    comparison.release_year.value = guessYear;
    if (guessYear === answerYear) {
        comparison.release_year.color = ":green_square:";
    } else if (guessYear > answerYear) {
        comparison.release_year.color = ":arrow_down:";
    } else if (guessYear < answerYear) {
        comparison.release_year.color = ":arrow_up:";
    }

    return comparison;
}

// Gets champion data
function getChampionData(championName, client) {
    for (const champion of client.championList) {
        if (champion.championName.toLowerCase() === championName.toLowerCase()) return champion;
    }
}