import {ActionGetExiftoolInfo} from "../config/actionGetExiftoolInfo";
import {ActionReadItemAttributesFromFile} from "./actionReadItemAttributesFromFile";
import {Attribute, attributeKeysEquals, MiniAttribute} from "./itemCommon";
import {ActionGetItemById} from "./actionGetItemById";
import {ItemDTO} from "../../../common/events/dtoModels";
import {logThen, voidThen} from "../../../common/utils";
import {ActionSetItemAttributes} from "./actionSetItemAttributes";
import {ActionGetLibraryAttributeMetaByKeys} from "../library/actionGetLibraryAttributeMetaByKeys";
import {AttributeMeta} from "../library/libraryCommons";


/**
 * reloads all attributes from the file
 */
export class ActionReloadItemAttributes {

	private readonly actionGetItem: ActionGetItemById;
	private readonly actionReadFileAttributes: ActionReadItemAttributesFromFile;
	private readonly actionGetAttributeMetaByKeys: ActionGetLibraryAttributeMetaByKeys;
	private readonly actionSetAttributes: ActionSetItemAttributes;


	constructor(actionGetItem: ActionGetItemById,
				actionGetExiftoolInfo: ActionGetExiftoolInfo,
				actionReadFileAttributes: ActionReadItemAttributesFromFile,
				actionGetAttributeMetaByKeys: ActionGetLibraryAttributeMetaByKeys,
				actionSetAttributes: ActionSetItemAttributes
	) {
		this.actionGetItem = actionGetItem;
		this.actionReadFileAttributes = actionReadFileAttributes;
		this.actionGetAttributeMetaByKeys = actionGetAttributeMetaByKeys;
		this.actionSetAttributes = actionSetAttributes;
	}


	public perform(itemId: number): Promise<void> {
		return this.getItem(itemId)
			.then(item => this.getFileAttributes(item.filepath))
			.then(attribs => this.enrichWithAttributeIds(attribs))
			.then(attribs => this.setAttributes(itemId, attribs))
			.then(voidThen);
	}

	private getItem(itemId: number): Promise<ItemDTO> {
		return this.actionGetItem.perform(itemId);
	}

	private getFileAttributes(filepath: string): Promise<Attribute[]> {
		return this.actionReadFileAttributes.perform(filepath);
	}

	private enrichWithAttributeIds(attributes: Attribute[]): Promise<MiniAttribute[]> {
		return this.actionGetAttributeMetaByKeys.perform(attributes.map(a => a.key))
			.then(attributeMeta => {
				return attributes
					.map(attribute => this.enrichWithAttributeId(attribute, attributeMeta))
					.filter(a => a !== null);
			});
	}

	private enrichWithAttributeId(attribute: Attribute, attributeMeta: AttributeMeta[]): MiniAttribute | null {
		const metaEntry = attributeMeta.find(am => attributeKeysEquals(am.key, attribute.key));
		if (metaEntry) {
			return {
				attId: metaEntry.attId,
				value: attribute.value
			};
		} else {
			return null;
		}
	}

	private setAttributes(itemId: number, attributes: MiniAttribute[]): Promise<void> {
		return this.actionSetAttributes.perform(itemId, attributes);
	}

}