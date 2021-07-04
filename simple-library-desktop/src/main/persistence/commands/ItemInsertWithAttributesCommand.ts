import {MetadataEntry} from "../../../common/commonModels";
import DataAccess from "../dataAccess";
import {ItemInsertCommand} from "./ItemInsertCommand";
import {CommandMultiple} from "./base/CommandMultiple";
import {AttributeInsertCommand} from "./AttributeInsertCommand";

export interface ModelItemInsertWithAttributes {
    filepath: string,
    timestamp: number,
    hash: string,
    thumbnail: string,
    attributes: MetadataEntry[]
}

export class ItemInsertWithAttributesCommand extends CommandMultiple {

    entry: ModelItemInsertWithAttributes;

    constructor(entry: ModelItemInsertWithAttributes) {
        super([]);
        this.entry = entry;
    }

    async run(dataAccess: DataAccess): Promise<void> {
        const itemId: number = await new ItemInsertCommand({
            filepath: this.entry.filepath,
            timestamp: this.entry.timestamp,
            hash: this.entry.hash,
            thumbnail: this.entry.thumbnail
        }).run(dataAccess)
        await new AttributeInsertCommand(itemId, this.entry.attributes).run(dataAccess)
    }
}
