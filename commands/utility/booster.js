const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { AttachmentBuilder } = require('discord.js');
const fs = require("fs");
const collectionFile = require("../../jsons/collection.json");
const cards = require("../../jsons/cards.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('booster')
		.setDescription('Opens a booster and adds the cards to your collection.')
		.addStringOption(option =>
		option.setName('booster-number')
				.setDescription('The booster you want to open')
				.setRequired(false),
		),
	async execute(interaction) {
		let cardsLeft = 12;
		let cardPulled = new Array(12);
		let userID = interaction.user.id;
		for(i=0;i<cardsLeft;i++){
			cardPulled[i] = cards[Math.floor(Math.random() * cards[-1].amount)].ID;
		}
		let j = 0;
		let channel = interaction.channel;
		channel.send({
			content:"",
			files: ["./img/"+cardPulled[j++]+".webp","./img/"+cardPulled[j++]+".webp","./img/"+cardPulled[j++]+".webp","./img/"+cardPulled[j++]+".webp","./img/"+cardPulled[j++]+".webp","./img/"+cardPulled[j++]+".webp"]
		})
		channel.send({
			content:"",
			files: ["./img/"+cardPulled[j++]+".webp","./img/"+cardPulled[j++]+".webp","./img/"+cardPulled[j++]+".webp","./img/"+cardPulled[j++]+".webp","./img/"+cardPulled[j++]+".webp","./img/"+cardPulled[j++]+".webp"]
		})
		return;
	},
};