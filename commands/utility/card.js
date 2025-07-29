const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('card')
		.setDescription('Send the picture of a card.')
		.addStringOption(option =>
		option.setName('card-number')
				.setDescription('The card you want a picture of')
				.setRequired(true),
		),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		try{
			const err = await interaction.reply({
			content:"",
			files: ["./img/"+interaction.options.getString('card-number').toUpperCase()+".webp"] 
		});
		} catch(err){
			interaction.reply("Couldn't find the card.");
		}
	},
};