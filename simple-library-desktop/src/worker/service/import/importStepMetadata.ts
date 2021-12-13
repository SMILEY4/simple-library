import {ItemData} from "./importService";
import {ActionReadItemAttributesFromFile} from "../item/actionReadItemAttributesFromFile";
import {Attribute} from "../item/itemCommon";
import {ActionGetCustomAttributeMeta} from "../library/actionGetCustomAttributeMeta";
import {AttributeMeta, DefaultAttributeValueEntry} from "../library/libraryCommons";
import {ActionGetDefaultAttributeValues} from "../library/actionGetDefaultAttributeValues";

export class ImportStepMetadata {

	private readonly actionReadAttributes: ActionReadItemAttributesFromFile;
	private readonly actionGetCustomAttributes: ActionGetCustomAttributeMeta;
	private readonly actionGetDefaultAttributeValues: ActionGetDefaultAttributeValues;

	constructor(
		actionReadAttributes: ActionReadItemAttributesFromFile,
		actionGetCustomAttributes: ActionGetCustomAttributeMeta,
		actionGetDefaultAttributeValues: ActionGetDefaultAttributeValues
	) {
		this.actionReadAttributes = actionReadAttributes;
		this.actionGetCustomAttributes = actionGetCustomAttributes;
		this.actionGetDefaultAttributeValues = actionGetDefaultAttributeValues;
	}

	public handle(itemData: ItemData): Promise<ItemData> {
		return this.actionReadAttributes.perform(itemData.filepath)
			.then((attributes: Attribute[]) => this.appendCustomAttributes(attributes))
			.then((attributes: Attribute[]) => itemData.attributes = attributes)
			.then(() => itemData)
	}

	private appendCustomAttributes(attributes: Attribute[]): Promise<Attribute[]> {
		return this.actionGetCustomAttributes.perform()
			.then((customAttributeMeta: AttributeMeta[]) => this.actionGetDefaultAttributeValues.perform()
				.then((entries: DefaultAttributeValueEntry[]) => {
					return customAttributeMeta.map(att => {
						const defaultEntry = entries.find(e => e.attributeMeta.attId === att.attId)
						return defaultEntry
							? ({attribute: att, value: defaultEntry.defaultValue})
							: ({attribute: att, value: ""})
					})
				}))
			.then((kvEntries: ({ attribute: AttributeMeta, value: string })[]) => kvEntries.map(kvEntry => ({
				attId: kvEntry.attribute.attId,
				key: kvEntry.attribute.key,
				value: kvEntry.value,
				type: kvEntry.attribute.type,
				writable: kvEntry.attribute.writable,
				modified: false,
				custom: true,
			})))
			.then((customAttribute: Attribute[]) => {
				return [...attributes, ...customAttribute]
			})
	}

}
