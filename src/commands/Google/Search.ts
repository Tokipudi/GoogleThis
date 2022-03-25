import { Dictionary, KnowledgePanel, Results, SearchResponse, Translation } from '@lib/interfaces/googlethis/SearchInterfaces';
import { RISCommand } from '@lib/structures/GoogleThisCommand';
import { RISCommandOptions } from '@lib/structures/GoogleThisCommandOptions';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, ChatInputCommand, ContextMenuCommand } from '@sapphire/framework';
import { CommandInteraction, ContextMenuInteraction, MessageEmbed, TextChannel } from 'discord.js';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';
import * as Google from 'googlethis';
import { getLinkPreview } from 'link-preview-js';

@ApplyOptions<RISCommandOptions>({
    name: 'search',
    description: 'Search a query on Google.'
})
export class Search extends RISCommand {

    public override async contextMenuRun(interaction: ContextMenuInteraction, context: ContextMenuCommand.RunContext) {
        const message = await interaction.channel.messages.fetch(interaction.targetId);
        if (!message) {
            return interaction.reply({
                content: 'Unable to load the message.',
                ephemeral: true
            });
        }

        if (message.content.length <= 0) {
            return interaction.reply({
                content: 'The message is empty.',
                ephemeral: true
            });
        }

        await interaction.deferReply();

        const channel = interaction.channel as TextChannel;

        const paginatedMessage = await this.generatePaginatedMessage(message.content, !channel.nsfw);

        let hasPages = false;
        for (let page of paginatedMessage.pages) {
            if ('embeds' in page && page.embeds.length > 0) {
                hasPages = true;
            }
        }
        if (!hasPages) {
            return interaction.editReply({
                content: `No results found for the message <${message.url}>.`
            });
        }

        return paginatedMessage.run(interaction);
    }

    public override async chatInputRun(interaction: CommandInteraction, context: ChatInputCommand.RunContext) {
        const query = interaction.options.getString('query', true);
        if (query.length <= 0) {
            return interaction.reply({
                content: 'The query cannot be empty.',
                ephemeral: true
            });
        }

        await interaction.deferReply();

        const channel = interaction.channel as TextChannel;

        const paginatedMessage = await this.generatePaginatedMessage(query, !channel.nsfw);

        let hasPages = false;
        for (let page of paginatedMessage.pages) {
            if ('embeds' in page && page.embeds.length > 0) {
                hasPages = true;
            }
        }
        if (!hasPages) {
            return interaction.editReply({
                content: `No results found for the query \`${query}\`.`
            });
        }

        return paginatedMessage.run(interaction);
    }

    private async generatePaginatedMessage(query: string, nsfw: boolean = false) {
        const search: SearchResponse = await Google.default.search(query, { page: 0, safe: nsfw, additional_params: { hl: 'en' } });

        const paginatedMessage = new PaginatedMessage();

        // Generate Knowledge Panel first
        const knowledgePanelEmbed = await this.generateKnowledgePanelEmbed(search.knowledge_panel);
        if (knowledgePanelEmbed) {
            paginatedMessage.addPageEmbed(knowledgePanelEmbed);
        }

        if ('dictionary' in search) {
            const dictionaryEmbed = await this.generateDictionaryEmbed(search.dictionary);
            if (dictionaryEmbed) {
                paginatedMessage.addPageEmbed(dictionaryEmbed);
            }
        }

        if ('translation' in search) {
            const translationEmbed = await this.generateTranslationEmbed(search.translation);
            if (translationEmbed) {
                paginatedMessage.addPageEmbed(translationEmbed);
            }
        }

        const resultsEmbeds = this.generateResultsEmbeds(search.results);
        const chunkSize = 5;
        for (let i = 0; i < resultsEmbeds.length; i += chunkSize) {
            paginatedMessage.addPageEmbeds(resultsEmbeds.slice(i, i + chunkSize));
        }

        return paginatedMessage;
    }

    private async generateKnowledgePanelEmbed(knowledgePanelData: KnowledgePanel): Promise<MessageEmbed | false> {
        if (
            (knowledgePanelData.title.length <= 0 || knowledgePanelData.title === 'N/A')
            && (knowledgePanelData.description.length <= 0 || knowledgePanelData.description === 'N/A')
            && (knowledgePanelData.url.length <= 0 || knowledgePanelData.url === 'N/A')
        ) {
            return false;
        }

        const embed = new MessageEmbed()
            .setColor('#4285F4')
            .setAuthor({
                name: knowledgePanelData.title,
                url: knowledgePanelData.url.length <= 0 || knowledgePanelData.url === 'N/A' ? '' : knowledgePanelData.url
            });

        let description = '';
        if (knowledgePanelData.type.length > 0 && knowledgePanelData.type !== 'N/A') {
            description += `*${knowledgePanelData.type}*\n\n`;
        }
        if (knowledgePanelData.description.length > 0 || knowledgePanelData.description !== 'N/A') {
            description += knowledgePanelData.description;
        }
        if (description.length > 0) {
            embed.setDescription(description);
        }

        if (knowledgePanelData.url.length > 0 && knowledgePanelData.url !== 'N/A') {
            const linkPreview = await getLinkPreview(knowledgePanelData.url);
            if ('images' in linkPreview && linkPreview.images.length > 0) {
                embed.setImage(linkPreview.images[0]);
            }
            if ('favicons' in linkPreview && linkPreview.favicons.length > 0) {
                for (let favicon of linkPreview.favicons) {
                    if (favicon.endsWith('.jpg') || favicon.endsWith('.png')) {
                        embed.setThumbnail(favicon);
                        break;
                    }
                }
            }
        }

        for (let k in knowledgePanelData) {
            const data = knowledgePanelData[k];
            if (
                k === 'title'
                || k === 'description'
                || k === 'url'
                || data.constructor.name == 'Array'
            ) {
                continue;
            }

            embed.addField(k, data, true);
        }

        return embed;
    }

    private async generateDictionaryEmbed(dictionaryData: Dictionary): Promise<MessageEmbed | false> {
        if (
            (dictionaryData.word.length <= 0 || dictionaryData.word === 'N/A')
            && dictionaryData.definitions.length <= 0
        ) {
            return false;
        }

        const embed = new MessageEmbed()
            .setAuthor({
                name: dictionaryData.word,
                url: dictionaryData.audio,
                iconURL: 'https://i.imgur.com/lbK1BPV.png'
            });
        if (dictionaryData.phonetic.length > 0 && dictionaryData.phonetic !== 'N/A') {
            embed.setDescription(`*${dictionaryData.phonetic}*`);
        }

        const definitionArray = []
        let i = 1;
        for (let definition of dictionaryData.definitions) {
            let str = `**${i}.** ${definition}`;
            if (dictionaryData.examples[i - 1] !== undefined) {
                str += `\n*ex: ${dictionaryData.examples[i - 1]}*`;
            }
            definitionArray.push(str);
            i++;
        }
        embed.addField('Definition(s)', definitionArray.join('\n\n'));

        return embed;
    }

    private async generateTranslationEmbed(translationData: Translation): Promise<MessageEmbed | false> {
        if (
            (translationData.source_text.length <= 0 || translationData.source_text === 'N/A')
            && (translationData.target_text.length <= 0 || translationData.target_text === 'N/A')
        ) {
            return false;
        }

        const embed = new MessageEmbed()
            .setAuthor({
                name: 'Translate',
                iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/512px-Google_Translate_logo.svg.png'
            })
            .addField(translationData.source_language, translationData.source_text, true)
            .addField(translationData.target_language, translationData.target_text, true);

        return embed;
    }

    private generateResultsEmbeds(results: Results): MessageEmbed[] {
        if (results.length <= 0) return [];

        const msgEmbeds = [];
        for (let result of results) {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: result.title,
                    url: result.url
                });

            if (result.description.length > 0 && result.description !== 'N/A') {
                embed.setDescription(result.description);
            }

            const favIcon = result.favicons.high_res ?? result.favicons.low_res;
            if (favIcon) {
                embed.setThumbnail(favIcon);
            }

            msgEmbeds.push(embed);
        }

        return msgEmbeds;
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerContextMenuCommand(
            {
                name: this.name,
                type: ApplicationCommandTypes.MESSAGE
            },
            {
                guildIds: this.guildIds
            }
        );

        registry.registerChatInputCommand(
            {
                name: this.name,
                description: this.description,
                options: [
                    {
                        name: 'query',
                        description: 'The query you want to search.',
                        type: 'STRING',
                        required: true
                    }
                ]
            },
            {
                guildIds: this.guildIds
            }
        )
    }
}