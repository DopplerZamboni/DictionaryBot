const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const config = require('./keys.json');

const client = new CommandoClient({
    owner: '143404700685959169',
    commandPrefix: '?',
    invite: 'https://discord.gg/zpU8rWm'
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['dictionary', 'Commands that dictionize']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(config.token);

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity('with words');
});

client.on('error', console.error);