
const { SlashCommandBuilder } = require('discord.js');
const Database = require("@replit/database");
const { log } = require("console");
const db = new Database();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('print')
    .setDescription('prints all key value pairs stored in the db to the console'),
  async execute(interaction) {
    await db.getAll().then((data) => {
      console.log(data.value);
    })
    
    await interaction.reply('printed successfully. Check console for results');
  },
};