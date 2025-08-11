const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { AttachmentBuilder } = require('discord.js');
const fs = require("fs");
const collectionFile = require("../../jsons/collection.json");
const cards = require("../../jsons/cards.json");
const timer = require("../../jsons/boosterTimer.json");
const delay = 3600000;

function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

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
		let cardPulled = new Array();
		let userID = interaction.user.id;
		let pullableCards = new Array();
		let boosterIdentifier = "GD";
		let j = 0;
		let channel = interaction.channel;
		let ownedCard = new Array();
		let ownedAmount = new Array();
		let boosterTiming;
		let remainingTime = 0;
		let now = Date.now();
		try {
			boosterTiming = timer[userID].time;
		} catch {
			boosterTiming = now;
		}
		if (now != boosterTiming && now - delay < boosterTiming) {
			remainingTime = (boosterTiming + delay - now);
			return interaction.reply({ content: "You can open a new booster in " + millisToMinutesAndSeconds(remainingTime), ephemeral: true });
		}
		try {
			ownedCard = collectionFile[userID].cards;
			ownedAmount = collectionFile[userID].cardAmount;
		} catch {
			channel.send("A new pilot! Welcome aboard. I'm going to add you to our files.");
		}
		let foundCard = false;
		let arg = interaction.options.getString('booster-number')
		if (arg != null) {
			boosterIdentifier += arg.toString().padStart(2, '0');
		}
		for (i = 0; i < cards[-1].amount; i++) {
			if (cards[i].ID.startsWith(boosterIdentifier)) {
				pullableCards.push(cards[i].ID);
			}
		}
		if (pullableCards.length == 0) {
			channel.send("Couldn't find the booster you specified. Opening from all available boosters.");
			for (i = 0; i < cards[-1].amount; i++) {
				if (cards[i].ID.startsWith("GD")) {
					pullableCards.push(cards[i].ID);
				}
			}
		}
		for (i = 0; i < cardsLeft; i++) {
			cardPulled.push(pullableCards[Math.floor(Math.random() * pullableCards.length)]);
		}
		for (i = 0; i < cardsLeft; i++) {
			for (k = 0; k < ownedCard.length; k++) {
				if (ownedCard[k] == cardPulled[i]) {
					foundCard = true;
					ownedAmount[k] += 1;
				}
			}
			if (!foundCard) {
				ownedCard.push(cardPulled[i]);
				ownedAmount.push(1);
			}
			foundCard = false;
		}
		collectionFile[userID] = {
			cards: ownedCard,
			cardAmount: ownedAmount
		};
		fs.writeFile("./jsons/collection.json", JSON.stringify(collectionFile), (err) => {
			if (err) console.log(err);
		})
		channel.send({
			content: "",
			files: ["./img/" + cardPulled[j++] + ".webp", "./img/" + cardPulled[j++] + ".webp", "./img/" + cardPulled[j++] + ".webp", "./img/" + cardPulled[j++] + ".webp", "./img/" + cardPulled[j++] + ".webp", "./img/" + cardPulled[j++] + ".webp"]
		})
		channel.send({
			content: "",
			files: ["./img/" + cardPulled[j++] + ".webp", "./img/" + cardPulled[j++] + ".webp", "./img/" + cardPulled[j++] + ".webp", "./img/" + cardPulled[j++] + ".webp", "./img/" + cardPulled[j++] + ".webp", "./img/" + cardPulled[j++] + ".webp"]
		})

		timer[userID] = {
			time: Date.now(),
		};
		fs.writeFile("./jsons/boosterTimer.json", JSON.stringify(timer), (err) => {
			if (err) console.log(err);
		})
		return interaction.reply("The cards have been added to your collection.");
	},
};