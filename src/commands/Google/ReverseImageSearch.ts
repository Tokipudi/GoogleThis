import { LooseObject } from '@lib/interfaces/UtilInterfaces';
import { RISCommand } from '@lib/structures/GoogleThisCommand';
import { RISCommandOptions } from '@lib/structures/GoogleThisCommandOptions';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, ContextMenuCommand } from '@sapphire/framework';
import { ContextMenuInteraction, Message, MessageEmbed, TextChannel } from 'discord.js';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';
import * as Google from 'googlethis';

@ApplyOptions<RISCommandOptions>({
    name: 'Reverse Image Search'
})
export class ReverseImageSearch extends RISCommand {

    public override async contextMenuRun(interaction: ContextMenuInteraction, context: ContextMenuCommand.RunContext) {
        const message = await interaction.channel.messages.fetch(interaction.targetId);
        if (!message) {
            return interaction.reply({
                content: 'Unable to load the message.',
                ephemeral: true
            });
        }

        const imageUrls = this.getImageUrlsFromMessage(message);
        if (imageUrls.length <= 0) {
            return interaction.reply({
                content: 'The message needs to have at least one image.',
                ephemeral: true
            });
        }

        await interaction.deferReply();

        const channel = interaction.channel as TextChannel;


        const resultUrls: LooseObject = {};
        let i = 0;
        // Avoid type error
        const googleThisApi = Google as any;
        for (let imageUrl of imageUrls) {
            const results = await googleThisApi.default.search(imageUrl, { ris: true, safe: !channel.nsfw, additional_params: { hl: 'en' } });
            resultUrls[i] = {
                url: imageUrl,
                results: results.results
            };
            i++;
        }

        const paginatedMessage = new PaginatedMessage();
        for (let k in resultUrls) {
            const result = resultUrls[k];

            let linkMsgArray = [];
            let i = 1;
            for (let data of result.results) {
                linkMsgArray.push(`**${i}.** [${data.title}](${data.url})`);
                i++;
            }

            const embed = new MessageEmbed()
                .setColor('#4285F4')
                .addField('Results', linkMsgArray.join('\n'))
                .setImage(result.url);

            paginatedMessage.addPageEmbed(embed);
        }

        await interaction.editReply(`Here are the results for the message: ${message.url}`);

        return paginatedMessage.run(interaction);
    }

    private getImageUrlsFromMessage(message: Message): string[] {
        const { attachments, embeds } = message;

        const urls = [];
        if (embeds.length > 0) {
            for (let embed of embeds) {
                if (embed.type === 'image') {
                    urls.push(embed.url);
                }
            }
        }

        if (attachments.size > 0) {
            attachments.forEach((attachment) => {
                if (attachment.contentType.startsWith('image')) {
                    urls.push(attachment.url);
                }
            });
        }

        return urls;
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerContextMenuCommand(
            {
                name: this.name,
                type: ApplicationCommandTypes.MESSAGE
            },
            {
                guildIds: this.guildIds,
                idHints: [
                    '957578239696572457' // Global
                ]
            }
        );
    }
}