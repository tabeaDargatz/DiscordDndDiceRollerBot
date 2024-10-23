const { SlashCommandBuilder } = require("discord.js");
const Database = require("@replit/database");
const db = new Database();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Shows statistic"),
  async execute(interaction) {
    const playerName = interaction.member.nickname;
    const id = interaction.user.username.toLowerCase();
    const nat20 = (await db.get(id + "nat20")).value ?? 0;
    const critFail = (await db.get(id + "critFail")).value ?? 0;
    const skillsUsed = (await db.list(id + "used")).value;

    let message = `Statistics for ${playerName}: \n`;
    message += `\`\`\`Nat 20s: ${nat20} \n`;
    message += `Critical failures: ${critFail} \n`;
    for(skill of skillsUsed){
      message += await generateSkillMessage(id, skill);
    }
    message += `\`\`\``;
    
    await interaction.reply(message);
  },
};

async function generateSkillMessage(id, skill){
  skillUsedCounter = (await db.get(skill)).value ?? "error";
  skillName = skill.substring(id.length+4);
  return `${skillName} skill used: ` + skillUsedCounter + `\n`;
}