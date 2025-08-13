const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const decks = require("../../jsons/decks.json");

function drawCard(array, amount){
	let cards = new Array()
}

function paperRockScisors(array, channel){
	let order;
	//send direct message to both players.
	//wait for reaction from both players before assigning a winner.
	channel.send("");
	return array;
}

function initiateArrays(array, nbJ){
	for(i = 0; i < nbJ ; i++){
		array[i] = new Array();
	}
	return array;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('duel')
		.setDescription('Start a duel with friends.')
		.addStringOption(option =>
			option.setName('nb-players')
				.setDescription('How many players for this duel, min 2, max 4. Default is 2')
				.setRequired(false),
		),
	async execute(interaction) {


let step = -1;
let playerNumber = 2; // between 2 and 4;
playerNumber = interaction.options.getString('nb-players');
let turnPlayer;
let decksToUse = new Array(playerNumber);
let hands = new Array(playerNumber);
let validTargets = new Array(playerNumber);
let UnitsInPlay = new Array(playerNumber);
let UnitsThatCanAttack = new Array(playerNumber);
hands = initiateArray(hands);
validTargets = initiateArray(validTargets);
let resources = new Array();
initiateArray(validTargets);
let playerOrder = new Array();
playerOrder = paperRockScisors(playerOrder);
switch(step){
case -1://Draw 5 cards, Mulligan?
console.log("Start Phase");
case 0://Activate all of your rested cards, gain 1 Resource card.
console.log("Resource phase");
case 1://The turn player draws one card from the top of their deck.
console.log("Draw Phase");
case 2://The turn player can play Bases, Units, Pilots, Commands.
	//Both players can play <Action> Command cards.
	//The turn player can declare an attack on : A Shield zone (Base => Shields), a Rested Enemy Unit
console.log("Main Phase");
case 3://Both players can play <Action> Command cards.
console.log("End Phase");
step = 0;
}