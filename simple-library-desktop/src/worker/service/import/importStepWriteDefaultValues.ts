import {ItemData} from "./importService";
import {ExifHandler} from "../exifHandler";
import {DefaultAttributeValueEntry} from "../library/libraryCommons";
import {ActionGetDefaultAttributeValues} from "../library/actionGetDefaultAttributeValues";
import {ActionGetExiftoolInfo} from "../config/actionGetExiftoolInfo";

export class ImportStepWriteDefaultValues {

	private readonly actionGetDefaultAttributeValues: ActionGetDefaultAttributeValues;
	private readonly actionGetExiftoolInfo: ActionGetExiftoolInfo;

	constructor(actionGetDefaultAttributeValues: ActionGetDefaultAttributeValues, actionGetExiftoolInfo: ActionGetExiftoolInfo) {
		this.actionGetDefaultAttributeValues = actionGetDefaultAttributeValues;
		this.actionGetExiftoolInfo = actionGetExiftoolInfo;
	}

	public handle(itemData: ItemData): Promise<ItemData> {
		return this.buildMetadata()
			.then(data => this.writeData(data, itemData.filepath))
			.then(() => itemData);
	}

	private async writeData(data: { overwrite: object | null, optional: object | null }, path: string): Promise<any> {
		if (data.overwrite) {
			await this.writeDataObject(path, data.overwrite, false);
		}
		if (data.optional) {
			await this.writeDataObject(path, data.optional, true);
		}
	}

	private writeDataObject(path: string, data: object, preventOverwrite: boolean): Promise<any> {
		return new ExifHandler(this.actionGetExiftoolInfo).writeMetadata(path, data, preventOverwrite);
	}

	private buildMetadata(): Promise<{ overwrite: object | null, optional: object | null }> {
		return this.actionGetDefaultAttributeValues.perform()
			.then((attribs: DefaultAttributeValueEntry[]) => attribs.filter(a => a.attributeMeta.custom !== true))
			.then((attribs: DefaultAttributeValueEntry[]) => this.attributesToMetadataObj(attribs));
	}

	private attributesToMetadataObj(attributes: DefaultAttributeValueEntry[]): { overwrite: object | null, optional: object | null } {
		const dataOverwrite: object = {};
		const dataOptional: object = {};
		let countOverwrite = 0;
		let countOptional = 0;
		attributes.forEach(attr => {
			const keyName = attr.attributeMeta.key.g0 + ":"
				+ attr.attributeMeta.key.g1 + ":"
				+ attr.attributeMeta.key.g2 + ":"
				+ attr.attributeMeta.key.name;
			if (attr.allowOverwrite) {
				(dataOverwrite as any)[keyName] = attr.defaultValue;
				countOverwrite++;
			} else {
				(dataOptional as any)[keyName] = attr.defaultValue;
				countOptional++;
			}
		});
		return {
			overwrite: countOverwrite > 0 ? dataOverwrite : null,
			optional: countOptional > 0 ? dataOptional : null
		};
	}

}
