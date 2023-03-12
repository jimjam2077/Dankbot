const { SlashCommandSubcommandBuilder } = require("discord.js");

/**
 * Use this class and its methods to add options onto a subcommand
 */
class SubOptionBuilder {
  #builder_name
  #builder_desc
  #builder

  constructor(name, description) {
    this.#builder_name = name;
    this.#builder_desc = description;
    this.#builder = new SlashCommandSubcommandBuilder()
      .setName(name)
      .setDescription(description);
    if (name.includes('mass')) {
      this.addMassUserOption();
    } else {
      this.addTargetUserOption();
    }
    this.addReasonOption();
  }
  

  /**
   * Retrieves the subcommand and its options from the optionbuilder
   * @returns {SlashCommandSubcommandBuilder} - the subcommandbuilder object as implemented by discord.js
   */
  getSubCmd() {
    return this.#builder;
  }


  /**
   * Makes the command temporary.
   * Will require the command caller to specify how long the command should last
   */
  makeCommandTemp() {
    if (this.#builder.name.includes('temp')) {
      this.#builder.addIntegerOption(option =>
        option.setName('duration')
          .setDescription('How long the punishment should last')
          .setRequired(true));
    }
  }


  /**
   * Adds a string option which allows the moderator to tag multiple users for action
   */
  addMassUserOption() {
    this.#builder.addStringOption(option =>
      option.setName('targets')
        .setDescription('Users to remove, by @mention or ID, separated by a space')
        .setRequired(true));
  }


  /**
   * Add a single target user option onto a builder
   * For example, a /kick command will need a user target to kick
   */
  addTargetUserOption() {
    this.#builder.addUserOption(option =>
      option.setName('target')
        .setDescription(`Mention or ID of user to ${this.#builder_name}`)
        .setRequired(true));
  }


  /**
 * Adds a  option to a command builder representing the reason a user is being removed
 */
  addReasonOption() {
    let required = false; //refactor this
    if (this.#builder.name.includes('ban')) { //ban commands should always have a reason (why? they have permanent effects)
      required = true;
    }
    this.#builder.addStringOption(option =>
      option.setName('reason')
        .setDescription('The behaviour the user is being punished for')
        .setMaxLength(512)
        .setRequired(required));
  }


  /**
   * Adds a choice of how many days worth of messages to purge when the command is called
   */
  addDeleteOption() {
    this.#builder.addIntegerOption(option =>
      option.setName('delete')
        .setDescription('Number of days worth of messages to purge')
        .addChoices(
          //0, 6, 12, 24, 72, 168 hrs in seconds
          { name: 'Don\'t delete any', value: 0 },
          { name: 'Last day', value: 86400 },
          { name: 'Last 3 days', value: 259200 },
          { name: 'Last 7 days', value: 604800 }
        )
        .setMinValue(0)
        .setMaxValue(604800));
  }



}

module.exports = SubOptionBuilder;
