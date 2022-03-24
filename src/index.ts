import { SapphireTemplateClient } from '@lib/SapphireTemplateClient';
import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env' });

const client = new SapphireTemplateClient({
    intents: [
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS'
    ],
    presence: {
        status: "online",
        activities: [{
            name: `Type ${process.env.COMMAND_PREFIX}help for more.`,
            type: 'PLAYING',
            url: 'https://github.com/Tokipudi/SapphireTemplate'
        }]
    },
    loadMessageCommandListeners: true,
    defaultPrefix: process.env.COMMAND_PREFIX,
});

client.login(process.env.DISCORD_TOKEN);
