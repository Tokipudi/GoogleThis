import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommandDeniedPayload, Events, Listener, ListenerOptions, PreconditionError } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
    name: Events.ChatInputCommandDenied
})
export class ChatInputCommandDenied extends Listener<typeof Events.ChatInputCommandDenied> {

    public async run(error: PreconditionError, payload: ChatInputCommandDeniedPayload) {
        const { interaction } = payload;

        const errMsg = `You are missing the required permissions to run this command.`;

        if (interaction.replied || interaction.deferred) {
            return interaction.editReply({
                content: errMsg
            });
        }

        return interaction.reply({
            content: errMsg,
            ephemeral: true
        });
    }
};