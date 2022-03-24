import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
    once: true,
    name: Events.ClientReady
})
export class Ready extends Listener<typeof Events.ClientReady> {

    public async run() {
        // Start message
        this.container.logger.info('|_ Loaded ' + this.container.stores.get('arguments').size + ' arguments.');
        this.container.logger.info('|_ Loaded ' + this.container.stores.get('commands').size + ' commands.');
        this.container.logger.info('|_ Loaded ' + this.container.stores.get('interaction-handlers').size + ' interaction handlers.');
        this.container.logger.info('|_ Loaded ' + this.container.stores.get('listeners').size + ' listeners.');
        this.container.logger.info('|_ Loaded ' + this.container.stores.get('preconditions').size + ' preconditions.');
    }
};