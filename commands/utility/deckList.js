const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const decks = require("../../jsons/decks.json");
const cards = require("../../jsons/cards.json");

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
		let deckId=-2;
		let maxNbDeck = decks[-1].deckCount;
		if((parseFloat(interaction.options.getString('deck')) == parseInt(interaction.options.getString('deck'))) && !isNaN(interaction.options.getString('deck'))){
			deckId = interaction.options.getString('deck');
		} else { 
			for(i = 0; i < decks[-1].deckCount; i++){
				if(decks[i].name.toLowerCase() == interaction.options.getString('deck').toLowerCase()){
					deckId=i;
				}
			}
		}
		if(deckId==-2){
			return interaction.reply("Couldn't find the deck you asked for.");
		}
		toSend += "Name: " + decks[deckId].name + "\nColors: " + decks[deckId].colors[0];
		if(decks[deckId].colors.length>1){
			toSend += ", " + decks[deckId].colors[1];
		}
		toSend += "\n";
		for(i = 0; i < decks[deckId].cardlist.length; i++){
			toSend+= + decks[deckId].amount[i] + " " + decks[deckId].cardlist[i] + " - " + cards[decks[deckId].cardlist[i]].name+ "\n";
		}
		return interaction.reply(toSend);
	},
};