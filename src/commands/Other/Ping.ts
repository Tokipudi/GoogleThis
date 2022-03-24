import { SapphireTemplateCommand } from '@lib/structures/SapphireTemplateCommand';
import { SapphireTemplateCommandOptions } from '@lib/structures/SapphireTemplateCommandOptions';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';

@ApplyOptions<SapphireTemplateCommandOptions>({
    requiredUserPermissions: 'ADMINISTRATOR',
    description: 'Ping? Pong!'
})
export class Ping extends SapphireTemplateCommand {

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