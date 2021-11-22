import {ActionGetExiftoolInfo} from "../config/actionGetExiftoolInfo";
import {ActionReadItemAttributesFromFile} from "./actionReadItemAttributesFromFile";
import {Attribute} from "./itemCommon";
import {ActionGetItemById} from "./actionGetItemById";
import {ItemDTO} from "../../../common/events/dtoModels";
import {voidThen} from "../../../common/utils";
import {ActionSetItemAttributes} from "./actionSetItemAttributes";


/**
 * reloads all attributes from the file
 */
export class ActionReloadItemAttributes {

	private readonly actionGetItem: ActionGetItemById;
	private readonly actionReadFileAttributes: ActionReadItemAttributesFromFile;
	private readonly actionSetAttributes: ActionSetItemAttributes;


	constructor(actionGetItem: ActionGetItemById,
				actionGetExiftoolInfo: ActionGetExiftoolInfo,
				actionReadFileAttributes: ActionReadItemAttributesFromFile,
				actionSetAttributes: ActionSetItemAttributes
	) {
		this.actionGetItem = actionGetItem;
		this.actionReadFileAttributes = actionReadFileAttributes;
		this.actionSetAttributes = actionSetAttributes;
	}


	public perform(itemId: number): Promise<void> {
		return this.getItem(itemId)
			.then(item => this.getFileAttributes(item.filepath))
			.then(attribs => this.setAttributes(itemId, attribs))
			.then(voidThen);
	}

	private getItem(itemId: number): Promise<ItemDTO> {
		return this.actionGetItem.perform(itemId);
	}

	private getFileAttributes(filepath: string): Promise<Attribute[]> {
		return this.actionReadFileAttributes.perform(filepath);
	}

	private setAttributes(itemId: number, attributes: Attribute[]): Promise<void> {
		return this.actionSetAttributes.perform(itemId, attributes);
	}

}