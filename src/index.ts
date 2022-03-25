import { GoogleThisClient } from '@lib/GoogleThisClient';
import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env' });

const client = new GoogleThisClient({
    intents: [
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS'
    ],
    presence: {
        status: "online",
        activities: [{
            name: `Look at my profile to know more.`,
            type: 'PLAYING',
            url: 'https://github.com/Tokipudi/ReverseImageSearch'
        }]
    },
    loadMessageCommandListeners: true
});

client.login(process.env.DISCORD_TOKEN);
