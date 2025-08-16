const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const decks = require("../../jsons/decks.json");
const cards = require("../../jsons/cards.json");

function getAllCardIds(array, cardFile){
	for(i = 0; i < cardFile[-1].amount; i++){
		array.push(cardFile[i].ID);
	}
	return array;
}

function getAllCardNames(array, cardFile){
	for(i = 0; i < cardFile[-1].amount; i++){
		array.push(cardFile[i].Name);
	}
	return array;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deck-list')
		.setDescription('Sends the cards from a deck.')
		.addStringOption(option =>
			option.setName('deck')
				.setDescription('The name or ID of the deck from which you want the list of card.')
				.setRequired(true),
		),
	async execute(interaction) {
		let toSend = "";
		let deckId = -2;
		let maxNbDeck = decks[-1].deckCount;
		if ((parseFloat(interaction.options.getString('deck')) == parseInt(interaction.options.getString('deck'))) && !isNaN(interaction.options.getString('deck'))) {
			deckId = interaction.options.getString('deck');
		} else {
			for (i = 0; i < maxNbDeck; i++) {
				if (decks[i].name.toLowerCase() == interaction.options.getString('deck').toLowerCase()) {
					deckId = i;
				}
				console.log()
			}
		}
		if (deckId == -2) {
			return interaction.reply("Couldn't find the deck you asked for.");
		}
		let cardNames = [decks[deckId].cardlist.length];
		let allCardNames = [cards[-1].amount];
		allCardNames = getAllCardNames(allCardNames, cards);
		let allCardIds = [cards[-1].amount];
		allCardIds = getAllCardIds(allCardIds, cards);
		toSend += "Name: " + decks[deckId].name + "\nColors: " + decks[deckId].colors[0];
		if (decks[deckId].colors.length > 1) {
			toSend += ", " + decks[deckId].colors[1];
		}
		toSend += "\n```";
		for( i = 0 ; i < decks[deckId].cardlist.length; i ++){
			console.log(decks[deckId].cardlist[i]);
			console.log(allCardIds);
			let index = allCardIds.indexOf(decks[deckId].cardlist[i]);
			console.log(index);
			cardNames[i] = allCardNames[index];
		}
		console.log(cardNames);
		for (i = 0; i < decks[deckId].cardlist.length; i++) {
			toSend += + decks[deckId].amount[i] + " " + decks[deckId].cardlist[i] + " - " + cardNames[i] + "\n";
		}
		toSend += "```";
		return interaction.reply(toSend);
	},
};