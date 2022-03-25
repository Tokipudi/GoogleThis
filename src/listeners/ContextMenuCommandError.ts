import { ApplyOptions } from '@sapphire/decorators';
import { ContextMenuCommandErrorPayload, Events, Listener, ListenerOptions, PreconditionError } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
    name: Events.ContextMenuCommandError
})
export class ContextMenuCommandError extends Listener<typeof Events.ContextMenuCommandError> {

    public async run(error: PreconditionError, payload: ContextMenuCommandErrorPayload) {
        const { interaction } = payload;

        this.container.logger.error(error);

        let errMsg = `An error occurred when trying to run this command.`;

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