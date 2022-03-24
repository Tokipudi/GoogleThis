import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommandErrorPayload, Events, Listener, ListenerOptions } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
    name: Events.ChatInputCommandError
})
export class ChatInputCommandError extends Listener<typeof Events.ChatInputCommandError> {

    public async run(error: Error, payload: ChatInputCommandErrorPayload) {
        const { interaction } = payload;

        let errMsg = `An error occurred when trying to run this command.`;

        this.container.logger.error(error);

        return interaction.replied || interaction.deferred
            ? interaction.followUp({
                content: errMsg,
                ephemeral: true
            })
            : interaction.reply({
                content: errMsg,
                ephemeral: true
            });
    }
};