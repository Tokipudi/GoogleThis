import { RISCommand } from '@lib/structures/RISCommand';
import { RISCommandOptions } from '@lib/structures/RISCommandOptions';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';

@ApplyOptions<RISCommandOptions>({
    requiredUserPermissions: 'ADMINISTRATOR',
    description: 'Ping? Pong!'
})
export class Ping extends RISCommand {

    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.reply(`Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms.`);
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description
        });
    }
}