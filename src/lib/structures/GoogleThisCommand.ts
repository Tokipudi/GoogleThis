import { Command, PieceContext } from "@sapphire/framework";
import { RISCommandOptions } from "./GoogleThisCommandOptions";

export abstract class RISCommand extends Command {

    guildIds: string[];

    public constructor(context: PieceContext, options?: RISCommandOptions) {
        super(context, options);
        this.guildIds = [
            '890643277081092117', // Nox Local
            '890917187412439040', // Nox Local 2
        ];
    }
}
