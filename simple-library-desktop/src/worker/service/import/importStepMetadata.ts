import {ItemData} from "./importService";
import {ActionReadItemAttributesFromFile} from "../item/actionReadItemAttributesFromFile";
import {Attribute} from "../item/itemCommon";
import {ActionGetCustomAttributeMeta} from "../library/actionGetCustomAttributeMeta";
import {AttributeMeta} from "../library/libraryCommons";

export class ImportStepMetadata {

	private readonly actionReadAttributes: ActionReadItemAttributesFromFile;
	private readonly actionGetCustomAttributes: ActionGetCustomAttributeMeta;

	constructor(
		actionReadAttributes: ActionReadItemAttributesFromFile,
		actionGetCustomAttributes: ActionGetCustomAttributeMeta
	) {
		this.actionReadAttributes = actionReadAttributes;
		this.actionGetCustomAttributes = actionGetCustomAttributes;
	}

	public handle(itemData: ItemData): Promise<ItemData> {
		return this.actionReadAttributes.perform(itemData.filepath)
			.then((attributes: Attribute[]) => this.appendCustomAttributes(attributes))
			.then((attributes: Attribute[]) => itemData.attributes = attributes)
			.then(() => itemData)
	}

	private appendCustomAttributes(attributes: Attribute[]): Promise<Attribute[]> {
		return this.actionGetCustomAttributes.perform()
			.then((customAttributeMeta: AttributeMeta[]) => customAttributeMeta.map(meta => ({
				attId: meta.attId,
				key: meta.key,
				value: "",
				type: meta.type,
				writable: meta.writable,
				modified: false,
				custom: true,
			})))
			.then((customAttribute: Attribute[]) => {
				return [...attributes, ...customAttribute]
			})
	}

}
