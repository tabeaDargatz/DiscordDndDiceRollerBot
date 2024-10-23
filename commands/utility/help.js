const { SlashCommandBuilder } = require("discord.js");
const output = `

**CHARACTER SETUP**
You can register skills for your character so that the modifiers are automatically added to your rolls.
      /register          registers a skill modifier for your character
      /unregister    deletes the skill modifier for your character
      /skills              shows all registered skill modifiers for your character

**ROLLING DICE**
To roll a check, use the following command. You can specify as many of the options as you want.
      /roll             rolls a d20
         [sides]         specifies the amount of sides
         [times]        specifies how many dice should be rolled
         [skill]           automatically adds the skill modifier (i.e. +2) that is registered for this person.
    
**STATS**
The bot will keep track of your d20 rolls and allows you to look at some semi interesting stats, I guess.
      /stats        shows a statistics of your crit fails, nat 20s, and skill usage.
      /reset        resets all statistics back to 0 for your character.
`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("See an explanation for this bot!"),
  async execute(interaction) {
    await interaction.reply(output);
  },
};