import { ApplyOptions } from '@sapphire/decorators';
import { AutocompleteInteractionPayload, Events, Listener, ListenerOptions } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
    name: Events.CommandAutocompleteInteractionError
})
export class CommandAutocompleteInteractionError extends Listener<typeof Events.CommandAutocompleteInteractionError> {

    public async run(error: Error, payload: AutocompleteInteractionPayload) {
        this.container.logger.error(error);
    }
};