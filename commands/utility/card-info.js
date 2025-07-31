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
		let toSend = "";
		for(i = 0; i < cards[-1].amount ; i++){
			if(cards[i].ID == interaction.options.getString('card-number').toUpperCase() || cards[i].Name.toUpperCase() == interaction.options.getString('card-number').toUpperCase()){
				if(toSend != "") toSend += "\n";
				toSend += "```Name: "+cards[i].Name;
				toSend += "\nColor: " +cards[i].Color + " | Type: " +cards[i].Type;
				if(cards[i].Color != "Token") toSend += "\nLV: " +cards[i].LV + " | Cost: " +cards[i].Cost;
				if(cards[i].Type != "Command") toSend += "\nAffiliation: " +cards[i].Affiliation;
				toSend += "\nEffect: " +cards[i].Effect;
				switch(cards[i].Type){
					case "Pilot": toSend += "\nPilot AP: "+cards[i].PilotAP+" | Pilot HP: "+cards[i].PilotHP+"\nPilot Effect: "+cards[i].PilotEffect;
					break;
					case "Unit": toSend += "\nAP: "+cards[i].AP+" | HP: "+cards[i].HP;
					break;
					case "Command-Pilot": toSend += "\nPilot Name: "+cards[i].PilotName+" | Pilot AP: "+cards[i].PilotAP+" | Pilot HP: "+cards[i].PilotHP;
					break;
					case "Base":toSend += "\nHP: "+cards[i].BaseHP;
					break;
					default:;
				}
				toSend +="```";
			}
		}
		if(toSend == "") toSend = "Couln't find the card.";
		const err = await interaction.reply(toSend);
	},
};