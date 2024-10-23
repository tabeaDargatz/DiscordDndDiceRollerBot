const { SlashCommandBuilder } = require("discord.js");
const Database = require("@replit/database")
const db = new Database()

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unregister")
    .setDescription("Unregister a skill")
    .addStringOption((option) =>
      option
        .setName("skill")
        .setDescription("skill to unregister")
        .addChoices(
          { name: "Acrobatics", value: "acrobatics" },
          { name: "Animal Handling", value: "animal_handling" },
          { name: "Arcana", value: "arcana" },
          { name: "Athletics", value: "athletics" },
          { name: "Deception", value: "deception" },
          { name: "History", value: "history" },
          { name: "Insight", value: "insight" },
          { name: "Intimidation", value: "intimidation" },
          { name: "Investigation", value: "investigation" },
          { name: "Medicine", value: "medicine" },
          { name: "Nature", value: "nature" },
          { name: "Perception", value: "perception" },
          { name: "Performance", value: "performance" },
          { name: "Persuasion", value: "persuasion" },
          { name: "Religion", value: "religion" },
          { name: "Sleight of Hand", value: "sleight_of_hand" },
          { name: "Stealth", value: "stealth" },
          { name: "Survival", value: "survival" }
        ),
    ),
  async execute(interaction) {
    const skill = interaction.options.getString("skill");
    const id = interaction.user.username;
    if(skill === null){
      await interaction.reply("Please provide a skill to unregister.");
      return;
    }
    const skillVal = (await db.get(id + skill)).value;
    if(skillVal === null){
      await interaction.reply(`Couldn't find skill to unregister`);
    } else {
      db.delete(id + skill);
      await interaction.reply(`Your ${skill} is now unregistered`);
    }
    
  },
};
