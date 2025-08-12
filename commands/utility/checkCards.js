const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const cardFile = require("../../jsons/cards.json");
const { Collection } = require('discord.js');

function getAllCards(cardsToReturn){
	for(i = 0; i < cards[-1].amount; i++){
		cardsToReturn.push(cards[i].ID);
	}
	return cardsToReturn
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check-cards')
		.setDescription('Displays the cards available.')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('Where the cards are from, such as a booster number (GD01...) a Starter Deck number (ST01...)')
				.setRequired(false),
		),
	async execute(interaction) {
		let cardsToDisplay = new Array();
		let userID = interaction.user.id;
		let cardNumber = 1;
		let keepOn = true;
		let cardIdentifier = null;
		let channel = interaction.channel;
		let arg = interaction.options.getString('booster-number')
		if (arg != null) {
			cardIdentifier = arg.toString();
		}
		if(cardIdentifier != null){
			for(i = 0; i < cards[-1].amount; i++){
				if(cards[i].ID.includes(cardIdentifier)){
					cardsToDisplay.push(cards[i].ID);
				}
			}
		}else{
			cardsToDisplay = getAllCards(cardsToDisplay);
		}
		if(cardsToDisplay.length == 0){
			channel.send("Couldn't find the source you specified, displaying all cards."),
			cardsToDisplay = getAllCards(cardsToDisplay);
		}
		const response = await interaction.reply({
			content: "Card: " + cardNumber + " / ``" + cardsToDisplay.length + "``",
			files: ["./img/" + cardsToDisplay[cardNumber - 1] + ".webp"],
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
								cardNumber = cardsToDisplay.length;
							}
							message.edit({
								content: "Card: " + cardNumber + " / ``" + cardsToDisplay.length + "``",
								files: ["./img/" + cardsToDisplay[cardNumber - 1] + ".webp"],
								withResponse: true
							});
							break;
						case '➡️':
							if (cardNumber != cardsToDisplay.length) {
								cardNumber++;
							} else {
								cardNumber = 1;
							}
							message.edit({
								content: "Card: " + cardNumber + " / ``" + cardsToDisplay.length + "``",
								files: ["./img/" + cardsToDisplay[cardNumber - 1] + ".webp"],
								withResponse: true
							});
							break;
						case '❌': keepOn = false;
						default:
							message.edit({
								content: "Closing display.",
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