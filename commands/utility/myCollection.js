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
		let cardNumber = 1;
		let keepOn = true;
		try {
			ownedCard = collectionFile[userID].cards;
			ownedAmount = collectionFile[userID].cardAmount;
		} catch {
			return interaction.reply("I doesn't seem like you own any card. Try opening a ``/booster``!");
		}
		const response = await interaction.reply({
			content: "Card: " + cardNumber + " / ``" + ownedCard.length + "`` | Quantity: ``" + ownedAmount[cardNumber - 1] + "``",
			files: ["./img/" + ownedCard[cardNumber - 1] + ".webp"],
			withResponse: true
		});
		const { message } = response.resource;
		message.react('⬅️')
			.then(() => message.react('❌'))
			.then(() => message.react('➡️'));
		const filter = (reaction, user) => {
			return ['⬅️', '❌', '➡️'].includes(reaction.emoji.name) && user.id === interaction.user.id;
		};
		while (keepOn) {
			await message.awaitReactions({ filter, time: 15000, max: 1, errors: ['time'] })
				.then(collected => {
					let reaction = collected.first();
					switch (reaction.emoji.name) {
						case '⬅️':
							if (cardNumber != 1) {
								cardNumber--;
							} else {
								cardNumber = ownedCard.length;
							}
							message.edit({
								content: "Card: " + cardNumber + " / ``" + ownedCard.length + "`` | Quantity: ``" + ownedAmount[cardNumber - 1] + "``",
								files: ["./img/" + ownedCard[cardNumber - 1] + ".webp"],
								withResponse: true
							});
							break;
						case '➡️':
							if (cardNumber != ownedCard.length) {
								cardNumber++;
							} else {
								cardNumber = 1;
							}
							message.edit({
								content: "Card: " + cardNumber + " / ``" + ownedCard.length + "`` | Quantity: ``" + ownedAmount[cardNumber - 1] + "``",
								files: ["./img/" + ownedCard[cardNumber - 1] + ".webp"],
								withResponse: true
							});
							break;
						case '❌': keepOn = false;
						default:
							message.edit({
								content: "Closing collection.",
								files: [],
								withResponse: false
							});
							return message.reactions.removeAll();
					}
					reaction.users.remove(userID);
				})
				.catch(error => console.log(error));
		}
	},
};