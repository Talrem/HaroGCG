const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const deckFile = require("../../jsons/decks.json");
const cards = require("../../jsons/cards.json");
/*
emojis to answer
	Amount 1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣
	Answer ✅❌
*/

/*
Card JSON Structure
id{
	user
	name
	cardlist
	amount
	color
}
*/
function getAllCardIDs() {
	let arrayToFill = new Array(cards[-1].amount);
	for (i = 0; i < cards[-1].amount; i++) {
		arrayToFill[i] = cards[i].ID;
	}
	return arrayToFill;
}

function getCardNumberFromID(id) {
	for (i = 0; i < cards[-1].amount; i++) {
		if (cards[i].ID == id) {
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
		let deckName = interaction.options.getString('name');
		let userID = interaction.user.id;
		let cardsToAdd = new Array();
		let amountToAdd = new Array();
		let colorsToAdd = new Array();
		let maxNbDeck = deckFile[-1].deckCount;
		let keepOn = true;
		let j = 0;
		let deckAmount = 0;
		let channel = interaction.channel;
		let step = 0; // 0 is cardID and color, 1 is Amount, 2 is deck is full
		let cardIDs = new Array(cards[-1].amount);
		const response = await interaction.reply({
			content: "Creating deck : " + deckName + "\nID : " + maxNbDeck + "\nSend the card ID that you want to add.\nWhen done, react to this message.\n✅ to validate. ❌ to cancel deck creation.",
			withResponse: true
		});
		const { message } = response.resource;
		message.react('✅')
			.then(await message.react('❌'));

		const validateOrCancelFilter = (reaction, user) => {
			return ['✅', '❌'].includes(reaction.emoji.name) && user.id === userID && user.bot == false;
		};

		message.awaitReactions({ validateOrCancelFilter, max: 1, time: 360000 })
			.then(collected => {
				let reaction = collected.first();
				switch (reaction.emoji.name) {
					case '✅':
						keepOn = false;
						if (step == 2) {
							let deckNumber = deckFile[-1].amount;
							deckFile[deckNumber] = {
								user: userID,
								name: deckName,
								cardlist: cardsToAdd,
								amount: amountToAdd,
								color: colorsToAdd
							};
							deckFile[-1] = {
								amount: deckFile[-1].amount + 1
							};
							fs.writeFile("./jsons/decks.json", JSON.stringify(deckFile), (err) => {
								if (err) console.log(err);
							})
							message.edit("Deck Creation Validated.");
							return channel.send("The deck was completed.");
						} else {
							message.edit("Deck Creation Canceled.");
							return channel.send("Couldn't add the deck because it was not full.");
						}
					case '❌':
						keepOn = false;
						return message.edit("Deck Creation Canceled.");
					default: return channel.send("An unknown error has occured.");
				}
			})
			.catch(error => console.log(error));

		cardIDs = getAllCardIDs();

		while (keepOn) {
			const msgFilter = (m) => m.author.id === userID;
			await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 30000 })
				.then(collected => {
					if (!keepOn) return;
					let msg = collected.first().content;
					if (step == 0 && !cardIDs.includes(msg)) {
						channel.send("Couldn't find that card.");
					} else {
						let cardNumber = getCardNumberFromID(msg);
						switch (step) {
							case 0:
								if (!cardsToAdd.includes(msg)) {
									if (colorsToAdd.length == 2 && !colorsToAdd.includes(cards[cardNumber].Color)) {
										channel.send("Couln't add the card because that would lead to too many colors in your deck.\n(Currently ``" + colorsToAdd + "`` and you tried to add ``" + cards[cardNumber].Color + "``)\n\nWaiting for a Card ID.");
									} else {
										cardsToAdd[j] = msg;
										if (!colorsToAdd.includes(cards[cardNumber].Color)) {
											colorsToAdd.push(cards[cardNumber].Color);
										}
										//since we managed to get a valid card, we can get to the next step.
										step = 1;
										channel.send("Valid Card specified.\n\nWaiting for amount.");
									}
								} else {
									channel.send("This card is already in your deck.\n\nWaiting for a Card ID.");
								}
								break;
							case 1:
								let nb = parseInt(msg)
								if (deckAmount + parseInt(msg) <= 50) {
									if (nb <= 4 && nb >= 1) {
										amountToAdd[j] = msg;
										deckAmount += parseInt(msg);
										//since we managed to get a valid amount, we can go back to the previous step.
										if (deckAmount < 50) {
											step = 0;
											j++;
											channel.send("Valid amount provided. Deck is currently at ``" + deckAmount + "``/50\n\nWaiting for next card.");
										} else {
											step = 2;
											channel.send("The deck is full. Validate the deck by reacting to the orginal message")
										}
									} else {
										channel.send("Couln't add the card because that would lead to too many cards with the same ID.\n\nWaiting for an amount.");
									}
								} else {
									channel.send("Counldn't add the card, the deck is full.")
								}
								break;
							case 2:
								channel.send("The deck is full. Cannot add any more cards. Validate the deck by reacting to the orginal message");
								break;
						}
					}
				})
		}
		channel.send("Command was ended because you took more than a minute to answer.")
	},
};