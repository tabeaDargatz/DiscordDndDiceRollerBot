const { SlashCommandBuilder } = require("discord.js");
const Database = require("@replit/database");
const db = new Database();
const defaultRowLength = 34; //34 whitespace characters needed to fill the row between the borders
const chunkSize = 4; // Number of values per row
const defaultSumRowLength = 7;
const defaultRollRowLength = defaultRowLength - defaultSumRowLength - 1;

/*
function constructMessage(sides, times, skill, skillBonus, rolls) {
  const s = times === 1 ? "" : "s";
  let message = `You rolled a d${sides} ${times} time${s} with the following result${s}: \n`;
  let bonusApplicable = false;
  for (let i = 0; i < rolls.length; i++) {
    let roll = rolls[i];
    if (roll === 1) {
      message += `**${roll} - Oof! Crit fail.** \n`;
    } else if (sides === 20 && roll === 20) {
      message += `**${roll} - YOOO Nat 20!** \n`;
    } else {
      roll += skillBonus;
      message += `${roll} \n`;
      bonusApplicable = true;
    }
  }

  const n = times === 1 ? "" : "n";
  if (skill && bonusApplicable) {
    message += `A${n} ${skill} bonus of ${skillBonus} was added to your roll${s}!`;
  }

  return message;
}
*/

function generateMessage(rollValues, diceType) {
  const diceTypeRow = createDiceTypeRow(diceType);
  const rollRows = createRollAndSumRows(rollValues);
  const output = `\`\`\`
  ╔══════════════════════════════════╗
  ║${diceTypeRow}║
  ╠══════════════════════════╤═══════╣
  ║           rolls          │  sum  ║
  ╟──────────────────────────┼───────╢
  ${rollRows}
  ╚══════════════════════════╧═══════╝
  \`\`\``;

  return output;
}

function createDiceTypeRow(diceType) {
  const paddingSize = (defaultRowLength - diceType.length) / 2;
  const paddingOdd = paddingSize % 1 != 0;
  const padding = " ".repeat(paddingSize);
  if (paddingOdd) {
    diceType += " ";
  }
  return padding + diceType + padding;
}

function createRollAndSumRows(rollValues) {
  const sum = rollValues.reduce((acc, val) => acc + val, 0);
  const chunks = splitToChunks(rollValues);

  //generates a row for each chunk and patches them together
  return chunks
    .map((chunk, index) => {
      const rollLine = chunk.map((val) => val.toString().padStart(4)).join(" ");
      const rollSubrow = createRollSubrow(rollLine);
      const sumSubrow = createSumSubrow(sum, index, chunks.length);
      return rollSubrow + sumSubrow;
    })
    .join("\n  ");
}

function splitToChunks(rollValues) {
  const chunks = [];
  for (let i = 0; i < rollValues.length; i += chunkSize) {
    chunks.push(rollValues.slice(i, i + chunkSize));
  }
  return chunks;
}

function createRollSubrow(rollLine) {
  const rollChars = rollLine.length;
  const paddingSize = (defaultRollRowLength - rollChars) / 2;
  const paddingOdd = paddingSize % 1 != 0;
  const padding = " ".repeat(paddingSize);
  if (paddingOdd) {
    rollLine += " ";
  }
  return `║${padding}${rollLine}${padding}│`;
}

function createSumSubrow(sum, index, chunkLength) {
  //if not last row: create empty sum subrow
  if (index != chunkLength - 1) {
    return " ".repeat(defaultSumRowLength) + "║";
  }

  let sumText = `[${sum}]`;
  const paddingSize = (defaultSumRowLength - sumText.length) / 2;
  const paddingOdd = paddingSize % 1 != 0;
  const padding = " ".repeat(paddingSize);
  if (paddingOdd) {
    sumText = " " + sumText;
  }

  return `${padding}${sumText}${padding}║`;
}

function rollDice(times, sides, skillBonus) {
  let rolls = [];

  for (let i = 0; i < times; i++) {
    let roll = Math.floor(Math.random() * sides) + 1;

    if (roll === 1) {
    } else if (roll === 20) {
    } else {
      roll += skillBonus;
    }
    rolls.push(roll);
  }
  return rolls;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Rolls dice!")
    .addIntegerOption((option) =>
      option
        .setName("sides")
        .setDescription("Specifies the number of sides on the die."),
    )
    .addIntegerOption((option) =>
      option
        .setName("times")
        .setDescription(
          "Specifies the number of times the die should be rolled.",
        ),
    )
    .addStringOption((option) =>
      option
        .setName("skill")
        .setDescription("Adds bonuses from the skill.")
        .addChoices(
          { name: "Acrobatics", value: "acrobatics" },
          { name: "Animal Handling", value: "animal handling" },
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
          { name: "Sleight of Hand", value: "sleight of hand" },
          { name: "Stealth", value: "stealth" },
          { name: "Survival", value: "survival" },
        ),
    ),
  async execute(interaction) {
    const sides = interaction.options.getInteger("sides") ?? 20;
    const times = interaction.options.getInteger("times") ?? 1;
    const skill = interaction.options.getString("skill");
    const id = interaction.user.username.toLowerCase();
    const playerName = interaction.member.nickname;
    const skillBonus = (await db.get(id + skill)).value ?? 0;
    let rolls = rollDice(times, sides, skillBonus);
    const diceType = `${times}d${sides}`;

    let message = ``;
    if (skill) {
      message += `**${playerName}** tries rolling a check for **${skill}**.\n A modifier of **${skillBonus}** was automatically added to all rolls, except for crit fails and nat 20s. \n`;
    }
    message += generateMessage(rolls, diceType);

    if(sides === 20){
      logStats(rolls, skill, id);
    }
    await interaction.reply(message);
  },
};

async function logStats(rolls, skill,id){
  const nat20Counter = rolls.filter((roll) => roll == 20).length;
  if(nat20Counter > 0){
    const nat20 = (await db.get(id + "nat20")).value ?? 0;
    await db.set(id + "nat20", nat20+nat20Counter);
  }
  
  const critFailCounter = rolls.filter((roll) => roll == 1).length;
  if(critFailCounter > 0){
    const critFail = (await db.get(id + "critFail")).value ?? 0;
    await db.set(id + "critFail", critFail+critFailCounter);
  }
  
  if(skill){
    let skillUsed = (await db.get(id + "used" + skill)).value ?? 0;
    skillUsed += rolls.length;
    await db.set(id + "used" + skill, skillUsed);
  }
}
