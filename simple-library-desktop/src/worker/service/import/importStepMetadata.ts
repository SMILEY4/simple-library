import {ItemData} from "./importService";
import {Attribute} from "../item/itemCommon";
import {ActionReadItemAttributesFromFile} from "../item/actionReadItemAttributesFromFile";

export class ImportStepMetadata {

	private readonly actionReadAttributes: ActionReadItemAttributesFromFile;

	constructor(actionReadAttributes: ActionReadItemAttributesFromFile) {
		this.actionReadAttributes = actionReadAttributes;
	}

	public handle(itemData: ItemData): Promise<ItemData> {
		return this.actionReadAttributes.perform(itemData.sourceFilepath)
			.then((entries: Attribute[]) => itemData.attributes = entries)
			.then(() => itemData);
	}

}
