const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const deckFile = require("../../jsons/decks.json");
const cards = require("../../jsons/cards.json");

function getAllCardIDs() {
	let arrayToFill = new Array(cards["-1"].amount);
	for (let i = 0; i < cards["-1"].amount; i++) {
		arrayToFill[i] = cards[i].ID;
	}
	return arrayToFill;
}

function getCardNumberFromID(id) {
	for (let i = 0; i < cards["-1"].amount; i++) {
		if (cards[i].ID === id) {
			return i;
		}
	}
	return null;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deck-create')
		.setDescription('Creates a new deck.')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('How you want to name the deck.')
				.setRequired(true),
		),
	async execute(interaction) {
		const deckName = interaction.options.getString('name');
		const userID = interaction.user.id;
		const cardsToAdd = [];
		const amountToAdd = [];
		const colorsToAdd = [];
		const maxNbDeck = deckFile["-1"].deckCount;
		let keepOn = true;
		let j = 0;
		let deckAmount = 0;
		let channel = interaction.channel;
		let step = 0; // 0 = card ID and color, 1 = amount, 2 = deck is full
		let oldMessage;
		const cardIDs = getAllCardIDs();

		await interaction.reply({
			content: `Creating deck : \`${deckName}\`\nID : \`${maxNbDeck}\`\nSend the card ID that you want to add.\nWhen done, react to this message.\n✅ to validate. ❌ to cancel deck creation.`,
			withResponse: true
		});

		const replyMsg = await interaction.fetchReply();

		await replyMsg.react('✅');
		await replyMsg.react('❌');

		const validateOrCancelFilter = (reaction, user) => {
			return ['✅', '❌'].includes(reaction.emoji.name) && user.id === userID && !user.bot;
		};

		const reactionCollector = replyMsg.createReactionCollector({ filter: validateOrCancelFilter, max: 1, time: 360000 });

		reactionCollector.on('collect', async (reaction) => {
			if (oldMessage?.deletable) await oldMessage.delete();

			switch (reaction.emoji.name) {
				case '✅':
					keepOn = false;
					if (step === 2) {
						const deckNumber = deckFile["-1"].deckCount;
						deckFile[deckNumber] = {
							user: userID,
							name: deckName,
							cardlist: cardsToAdd,
							amount: amountToAdd,
							colors: colorsToAdd
						};
						deckFile["-1"].deckCount += 1;

						fs.writeFile("./jsons/decks.json", JSON.stringify(deckFile, null, 2), (err) => {
							if (err) console.log(err);
						});

						await replyMsg.edit("Deck Creation Validated.");
						await channel.send("The deck was completed.");
					} else {
						await replyMsg.edit("Deck Creation Canceled.");
						await channel.send("Couldn't add the deck because it was not full.");
					}
					break;

				case '❌':
					keepOn = false;
					await replyMsg.edit("Deck Creation Canceled.");
					break;
			}
		});

		while (keepOn) {
			try {
				const collected = await channel.awaitMessages({
					filter: m => m.author.id === userID,
					max: 1,
					time: 30000
				});

				const userMsg = collected.first();
				const msg = userMsg.content;

				if (oldMessage?.deletable) await oldMessage.delete();

				if (step === 0) {
					if (!cardIDs.includes(msg)) {
						oldMessage = await channel.send("Couldn't find that card.");
					} else if (cardsToAdd.includes(msg)) {
						oldMessage = await channel.send("This card is already in your deck.\n\n`Waiting for a Card ID.`");
					} else {
						const cardNumber = getCardNumberFromID(msg);
						const cardColor = cards[cardNumber].Color;

						if (colorsToAdd.length === 2 && !colorsToAdd.includes(cardColor)) {
							oldMessage = await channel.send(`Couldn't add the card because that would lead to too many colors in your deck.\n(Currently \`${colorsToAdd}\`, tried to add \`${cardColor}\`)\n\n\`Waiting for a Card ID.\``);
						} else {
							cardsToAdd[j] = msg;
							if (!colorsToAdd.includes(cardColor)) {
								colorsToAdd.push(cardColor);
							}
							step = 1;
							oldMessage = await channel.send("Valid Card specified.\n\n`Waiting for an amount.`");
						}
					}
					await userMsg.delete();

				} else if (step === 1) {
					const nb = parseInt(msg);
					if (isNaN(nb) || nb < 1 || nb > 4) {
						oldMessage = await channel.send("Invalid amount. Must be between 1 and 4.\n\n`Waiting for an amount.`");
					} else if (deckAmount + nb > 50) {
						oldMessage = await channel.send("Couldn't add the card, the deck is full.");
					} else {
						amountToAdd[j] = nb;
						deckAmount += nb;
						if (deckAmount < 50) {
							step = 0;
							j++;
							oldMessage = await channel.send(`Valid amount provided. Deck is currently at \`${deckAmount}\`/50\n\n\`Waiting for next card's ID.\``);
						} else {
							step = 2;
							oldMessage = await channel.send("The deck is full. Validate the deck by reacting to the original message.");
						}
					}
					await userMsg.delete();

				} else if (step === 2) {
					oldMessage = await channel.send("The deck is full. Validate the deck by reacting to the original message.");
					await userMsg.delete();
				}
			} catch (err) {
				keepOn = false;
				await channel.send("Command was ended because you took more than a minute to answer.").then(msg => {
					setTimeout(() => msg.delete(), 10000);
				});
			}
		}
	}
};