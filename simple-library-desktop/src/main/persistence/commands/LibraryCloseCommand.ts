import DataAccess from "../dataAccess";
import {CommandCustom} from "./base/CommandCustom";


export class LibraryCloseCommand extends CommandCustom<void> {

    async run(dataAccess: DataAccess): Promise<void> {
        dataAccess.closeDatabase();
    }
}
