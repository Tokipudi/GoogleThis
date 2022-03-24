import { Command, PieceContext } from "@sapphire/framework";
import { SapphireTemplateCommandOptions } from "./SapphireTemplateCommandOptions";

export abstract class SapphireTemplateCommand extends Command {

    guildIds: string[];

    public constructor(context: PieceContext, options?: SapphireTemplateCommandOptions) {
        super(context, options);
        this.guildIds = [
            '890643277081092117', // Nox Local
            '890917187412439040', // Nox Local 2
        ];
    }
}
