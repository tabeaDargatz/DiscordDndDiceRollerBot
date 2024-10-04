const { SlashCommandBuilder } = require("discord.js");
const Database = require("@replit/database")
const db = new Database()

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register a skill modifier!")
    .addIntegerOption((option) => 
      option.setName("modifier")
                     .setDescription("modifier")
                     )
    .addStringOption((option) =>
      option
        .setName("skill")
        .setDescription("skill to register modifier for")
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
    const modifier = interaction.options.getInteger("modifier");
    db.set(id + skill, modifier);

    await interaction.reply(`Your ${skill} is now set to ${modifier}`);
  },
};
