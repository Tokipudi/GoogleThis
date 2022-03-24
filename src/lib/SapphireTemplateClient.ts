import { ApplicationCommandRegistries, RegisterBehavior, SapphireClient } from '@sapphire/framework';
import '@sapphire/plugin-logger/register';
import { ClientOptions } from "discord.js";

export class SapphireTemplateClient extends SapphireClient {

    public constructor(options: ClientOptions) {
        super(options);
        ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);
    }
}