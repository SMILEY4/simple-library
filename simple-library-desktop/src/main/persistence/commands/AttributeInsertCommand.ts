import {Command} from "./base/Command";
import {sqlInsertItemAttribs} from "../sql/sql";
import {MetadataEntry} from "../../../common/commonModels";


export class AttributeInsertCommand extends Command {

    constructor(itemId: number, attributes: MetadataEntry[]) {
        super(sqlInsertItemAttribs(itemId, attributes));
    }

}
