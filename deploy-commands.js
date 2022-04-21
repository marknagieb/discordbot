const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    new SlashCommandBuilder().setName('tictactoe').setDescription('Play a game of tic-tac-toe'),
    new SlashCommandBuilder().setName('calculator').setDescription('Calculator'),
]

const rest = new REST({ version: '9' }).setToken(token)

rest.put(Routes.applicationCommands(clientId, guildId), { body: commands.map(command => command.toJSON() ) })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);