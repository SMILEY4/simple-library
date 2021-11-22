import {ItemData} from "./importService";
import {ActionReadItemAttributesFromFile} from "../item/actionReadItemAttributesFromFile";
import {Attribute} from "../item/itemCommon";

export class ImportStepMetadata {

	private readonly actionReadAttributes: ActionReadItemAttributesFromFile;

	constructor(actionReadAttributes: ActionReadItemAttributesFromFile) {
		this.actionReadAttributes = actionReadAttributes;
	}

	public handle(itemData: ItemData): Promise<ItemData> {
		return this.actionReadAttributes.perform(itemData.filepath)
			.then((entries: Attribute[]) => itemData.attributes = entries)
			.then(() => itemData)
	}

}
