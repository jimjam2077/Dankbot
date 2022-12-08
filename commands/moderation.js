/*
HOW TO READ COMMAND FILES:
 - Each command file contains a "group" of commands which fall under a particular umbrella.
   in this case - moderation activities; things server admins can use to keep the server safe and usable.

- the command group is at the top level, named 'mod'
- the subcommands are blocks of code which allocate the names, descriptions, and options for the actual callable commands.
- in discord this appears thusly: /mod kick, /mod ban, /mod masskick.
- /mod CANNOT be called by itself, as a consequence of being subcommanded
- for safety, subcommands with options that require some target should always be required = true

- at the end of the file is the interaction resolver. here, behaviour must be specified for each subcommand (or it will do nothing).
  retrieve the name and input of the interaction using interaction.options methods and go from there.
*/

// see: https://discordjs.guide/slash-commands/advanced-creation.html#option-types for the allowed input types

const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('discord.js');


/**
 * use to add a single target user subcommand to a given command (i.e. kick)
 * @param {SlashCommandBuilder, SlashSubCommandBuilder} builder - object to add options/subcommands to
 */
function addTargetUserOption(builder) {
    return builder
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Mention or ID or user to remove')
                .setRequired(true))
}

//can this be refactored?
//https://github.com/Markkop/corvo-astral/tree/master/src/commands
//get the slash command builder and split things up as above
module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('Moderation commands') //note: even though this is invisible to the user, it is required by command.tojson

        /*KICK - removes a single user from the server
        Required: target; Optional: reason*/
        .addSubcommand(subcommand =>
            subcommand
                .setName('kick')
                .setDescription('Kicks a user from the server.')
                //a user option pops up a list of users
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('Mention or ID of user to remove')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The behaviour the user is being banned for')
                        .setMaxLength(512)))

        /*MASSKICK - used to purge multiple users at a time
        Required: a target list.
        This must be a String as Mentionable and User would only let us access one object*/
        .addSubcommand(subcommand =>
            subcommand
                .setName('masskick')
                .setDescription('Kicks multiple users from the server at once.')
                .addStringOption(option =>
                    option.setName('targets')
                        .setDescription('Users to remove, by @mention or ID, separated by a space')
                        .setRequired(true)))

        /* BAN - remove a single user from the server permanently
        Required: target; Optional: delete history (up to 7 days in secs), reason*/
        .addSubcommand(subcommand =>
            subcommand
                .setName('ban')
                .setDescription('Bans a user')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('Mention or ID of user to ban')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('delete')
                        .setDescription('How much of the message history to delete')
                        .addChoices(
                            //0, 6, 12, 24, 72, 168 hrs in seconds
                            { name: 'Don\'t delete any', value: 0 },
                            { name: 'Last day', value: 86400 },
                            { name: 'Last 3 days', value: 259200 },
                            { name: 'Last 7 days', value: 604800 }
                        ))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The behaviour the user is being banned for')
                        .setMaxLength(512)))


        //TEMPBAN Command - Bans a user for a specified amount of time
        .addSubcommand(subcommand =>
            subcommand
                .setName('tempban')
                .setDescription('Bans a user for a specified amount of time [NYI]')
                //a string option will allow all inputs. these need to be resolved appropriately
                .addStringOption(option =>
                    option.setName('target')
                        .setDescription('User to remove')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('delete')
                        .setDescription('How much of the message history to delete')
                        .addChoices(
                            //0, 6, 12, 24, 72, 168 hrs in seconds
                            { name: 'Don\'t delete any', value: 0 },
                            { name: 'Last day', value: 86400 },
                            { name: 'Last 3 days', value: 259200 },
                            { name: 'Last 7 days', value: 604800 }
                        ))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The behaviour the user is being banned for')
                        .setMaxLength(512))
                .addIntegerOption(option=>
                    option.setName('duration')
                    .setDescription('How long the user should stay banned for')
                    .setRequired(true)))


        //SOFTBAN Command - Bans and unbans a member to purge messages
        .addSubcommand(subcommand =>
            subcommand
                .setName('softban')
                .setDescription('Kicks multiple users from the server at once.')
                //a string option will allow all inputs. these need to be resolved appropriately
                .addStringOption(option =>
                    option.setName('targets')
                        .setDescription('User to remove')
                        .setRequired(true))),

    //Resolve the interaction here - each subcommand requires a different resolution.
    //interaction methods return different things about what happened in the command (i.e. target)
    async execute(interaction) {
        let subc = interaction.options.getSubCommand(); //name of the called command
        switch (subc) {
            case 'kick':
                await interaction.reply('I am ready to work!');
                break;
            case 'masskick':
                await interaction.reply('I am ready to work!');
                break;
            case 'ban':
                await interaction.reply('I am ready to work!');
                break;
            case 'tempban':
                await interaction.reply('I am ready to work!');
                break;
            case 'softban':
                await interaction.reply('I am ready to work!');
                break;
        }
    },
};