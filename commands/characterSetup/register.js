const { SlashCommandBuilder } = require("discord.js");
const Database = require("@replit/database")
const db = new Database()

const insults = ['Do you are have stupid?', "Try again, bitch.", "LMAOOO, get a load of this guy. Too dumb to use this command.", "Not the brightest, are we?", "Are you blind or something?", "You can't be serious, my guy."]

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register a skill modifier!")
    .addIntegerOption((option) => 
      option.setName("modifier")
                     .setDescription("modifier")
                     .setRequired(true)
                     )
    .addStringOption((option) =>
      option
        .setName("skill")
        .setDescription("skill to register modifier for")
        .setRequired(true)
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
    if(skill === null || modifier === null){
      await interaction.reply(insults[Math.floor(Math.random() * insults.length)]);
      return;
    }
    db.set(id + skill, modifier);

    await interaction.reply(`Your ${skill} is now set to ${modifier}`);
  },
};
