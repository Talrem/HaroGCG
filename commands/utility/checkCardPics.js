const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check-card-pics')
		.setDescription('Tells which cards are missing from the image database.'),
	async execute(interaction) {
		let textToSend = "";
		let path = "";
		var missingPic = new Array();
		let origin = ["T", "GD01", "ST01", "ST02", "ST03", "ST04"];
		let maxID = [11, 130, 16, 16, 16, 16];
		let cardID = "";
		for (i = 0; i < origin.length; i++) {
			for (j = 1; j <= maxID[i]; j++) {
				cardID = j.toString().padStart(3, '0');
				path = './img/' + origin[i] + '-' + cardID + '.webp';
				if (!fs.existsSync(path)) {
					missingPic.push(origin[i] + '-' + cardID);
					textToSend += origin[i] + '-' + cardID + "\n";
				}
			}
		}
		if (missingPic.length > 0) {
			return interaction.reply("The following cards are missing from the database:\n" + textToSend);
		} else {
			return interaction.reply("No missing Cards in picture database.");
		}
	},
};