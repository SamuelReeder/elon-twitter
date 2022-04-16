import fetch from 'node-fetch';
import Discord from 'discord.js';

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"] });

const url = 'https://api.twitter.com/2/users/44196397/tweets?expansions=author_id&max_results=5';
const bearerToken = '';

let currentId = '';

const PREFIX = '>';
let channel;
let first = true;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);


    setInterval(async () => {
        const response = await fetch(url, {
            headers: {
                Authorization: 'Bearer ' + bearerToken,
            }
        });
        const data = await response.json();
        console.log(data);
        let newId;
        try {
            newId = data.data[0].id;
        } catch(err) {
            console.log(err);
            return;
        }

        if (newId != currentId) {
            currentId = newId;

            if (first) {
                first = false;
                return;
            }

            channel.send(genUrl(currentId));

            // SEND TO ALL CHANNELS
            // client.channels.cache.forEach((channel) => {
            //     if (channel.isText()) {
            //         // channel.send(genUrl(currentId));
            //         console.log(channel.name + channel.id);
            //         client.channels.cache.get(channel.id).send(genUrl(currentId));
            //     }
            // });
        }
    }, 60000);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    channel = client.channels.cache.find(channel => channel.name ===  message.content.substring(1));

    channel.send('Will send to: ' + message.content.substring(1));
});

function genUrl(id) {
    return 'https://twitter.com/elonmusk/status/' + id;
}

client.login('');