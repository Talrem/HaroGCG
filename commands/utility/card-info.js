const { SlashCommandBuilder } = require('discord.js');
const cards = require("../../jsons/cards.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('card-info')
		.setDescription('Sends all the information on a card')
		.addStringOption(option =>
		option.setName('card-number')
				.setDescription('The card for which you want the information')
				.setRequired(true),
		),
	async execute(interaction) {
		let toSend = "Couldn't find the card.";
		toSend = cards[interaction.options.getString('card-number').toUpperCase()].Name;
		const err = await interaction.reply(toSend);
	},
};