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
            name: `Let me google that for you`,
            type: 'PLAYING',
            url: 'https://github.com/Tokipudi/GoogleThis'
        }]
    },
    loadMessageCommandListeners: true
});

client.login(process.env.DISCORD_TOKEN);
