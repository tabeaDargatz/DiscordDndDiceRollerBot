const { SlashCommandBuilder } = require("discord.js");
const Database = require("@replit/database");
const db = new Database();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skills")
    .setDescription("Show all registered skills."),
  async execute(interaction) {
    const id = interaction.user.username.toLowerCase();
    const playerName = interaction.member.nickname;
    const skills = (await db.list(id)).value ?? 0;
    
    let message = `Registered skills for **${playerName}**: \n`;
    for(let i = 0; i < skills.length; i++){
      let skill = skills[i].substring(id.length);

      if(skill !== "nat20" && skill !== "critFail" && skill.substring(0,4) !== "used"){
        let modifier = (await db.get(skills[i])).value;
        skill = skill.charAt(0).toUpperCase() + skill.substring(1);
        skill = skill.replace("_"," ");
        message += `**${skill}**: ${modifier} \n`;
      }

    }

    await interaction.reply(message);
  },
};