const {Command} = require('discord.js-commando');
const Dictionary = require("oxford-dictionary");
const config = require('../../keys.json');

const dictionaryConfig = {
    app_id: config.app_id,
    app_key: config.app_key,
    source_lang: "en-us"
};
const dict = new Dictionary(dictionaryConfig);
const {MessageEmbed} = require('discord.js');
module.exports = class define extends Command {
    constructor(client) {
        super(client, {
            name: 'define',
            aliases: ['d'],
            group: 'dictionary',
            description: 'Gets the definition of a word or phrase',
            memberName: 'define',
            args: [
                {
                    key: 'query',
                    prompt: 'What would you like to look up?',
                    type: 'string',
                },
            ],
        });
    }

    async run(message, {query}) {
        let lookup = dict.find(query);

        lookup.then(function (res) {
                // stringify JSON object to see full structure in console log

                let results = res.results;
                let definitions = new Object();

                for (let ii = 0; ii < results.length; ii++) {
                    let result = results[ii].lexicalEntries;

                    for (let jj = 0; jj < result.length; jj++) {
                        let senses = result[jj].entries[0].senses;
                        let category = result[jj].lexicalCategory.text;

                        for (let nn = 0; nn < senses.length; nn++) {
                            let definition = senses[nn].definitions[0];
                            if (!(category in definitions)) {
                                definitions[category] = [];
                            }
                            definitions[category].push((definition + "\n"));
                        }
                    }
                }

                if (!definitions){
                    message.reply("Your query returned no results. Please try again.")
                }
                else {
                    let thisEmbed = new MessageEmbed()
                        .setColor('#990000')
                        .setTimestamp()
                        .setTitle(query.charAt(0).toUpperCase() + query.slice(1))
                        .setFooter("Bot created by Owen Vogelgesang 2020", 'https://i.imgur.com/Nvx5I7N.png')
                        .setAuthor('DictionaryBot', 'https://i.imgur.com/Nvx5I7N.png')
                        .setThumbnail('https://i.imgur.com/Nvx5I7N.png')
                        .setDescription(`Definition of ${query.charAt(0).toUpperCase() + query.slice(1)}, from the Oxford Dictionary.`);

                    for (let ii = 0; ii < Object.keys(definitions).length; ii++) {
                        let categoryName = Object.getOwnPropertyNames(definitions)[ii];
                        let finalText = "";
                        for (let jj = 0; jj < definitions[categoryName].length; jj++) {
                            finalText += `${jj+1}: ${definitions[categoryName][jj]}`
                        }
                        thisEmbed.addField(categoryName, finalText, false)
                    }
                    message.channel.send(thisEmbed);
                }
            },
            function (err) {
                console.log(err);
            });
    }
}