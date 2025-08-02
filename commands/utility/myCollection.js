const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const collectionFile = require("../../jsons/collection.json");
const { Collection } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('my-collection')
		.setDescription('Tells you which cards are in your collection.'),
	async execute(interaction) {
		let ownedCard = new Array();
		let ownedAmount = new Array();
		let userID = interaction.user.id;
		let channel = interaction.channel;
		let cardNumber = 1;
		try {
			ownedCard = collectionFile[userID].cards;
			ownedAmount = collectionFile[userID].cardAmount;
		} catch {
			return interaction.reply("I doesn't seem like you own any card. Try opening a ``/booster``!");
		}
		const response = await interaction.reply({
			content: "Card: " + cardNumber + " / " + ownedCard.length + " | Quantity: " + ownedAmount[cardNumber - 1],
			files: ["./img/" + ownedCard[cardNumber - 1] + ".webp"],
			withResponse: true
		});
		const { message } = response.resource;
		message.react('⬅️').then(() => message.react('❌')).then(() => message.react('➡️'))
			.then(channel.send("Awaiting reaction."));
		const collectorFilter = (reaction, user) => {
			return ['⬅️', '❌', '➡️'].includes(reaction.emoji.name);
		};
		message.awaitReactions({ filter: collectorFilter, max: 1, time: 60_000, errors: ['time'] })
			.then(collected => console.log(collected.size))
			.catch(collected => {
				console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
			});
	},
};