const { SlashCommandBuilder } = require("discord.js");
const Database = require("@replit/database");
const { log } = require("console");
const db = new Database();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Resets statistics for a player."),
  async execute(interaction) {
    const playerName = interaction.member.nickname;
    const id = interaction.user.username.toLowerCase();
    let ok = true;
    
    let skillsUsed = (await db.list(id + "used")).value;
    if(skillsUsed){
      for(skill of skillsUsed){
        let result = await db.delete(skill);
        if(result.ok === false){
          ok = false;
          console.log(result);
        }
      }
    }

    let nat20 = (await db.get(id + "nat20")).value;
    if(nat20){
      let result = await db.delete(id + "nat20");
      if(result.ok === false){
        ok = false;
        console.log(result);
      }
    }
    
    let critFail = (await db.get(id + "critFail")).value;
    if(critFail){
      let result = (await db.delete(id+"critFail"));
      if(result.ok === false){
        ok = false;
        console.log(result);
      }
    }

    if(ok){
      await interaction.reply(`Statistics for ${playerName} have been reset.`);
    } else {
      await interaction.reply(`Error resetting statistics for ${playerName}.`);
    }
    
  },
};