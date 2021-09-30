import {ItemData} from "./importService";
import {ActionGetExiftoolInfo} from "../config/actionGetExiftoolInfo";
import {Attribute, stringToAttributeValue, valueToAttributeType} from "../item/itemCommon";
import {ExifHandler} from "../exifHandler";

export class ImportStepMetadata {

	// private readonly exifHandler: ExifHandler;
	private readonly actionGetExiftoolInfo: ActionGetExiftoolInfo;

	constructor(actionGetExiftoolInfo: ActionGetExiftoolInfo) {
		this.actionGetExiftoolInfo = actionGetExiftoolInfo;
		// this.exifHandler = new ExifHandler(actionGetExiftoolInfo, false);
	}


	public handle(itemData: ItemData): Promise<ItemData> {
		return new ExifHandler(this.actionGetExiftoolInfo)
			.readMetadata(itemData.sourceFilepath)
			.then((data: any) => this.flatten(data.data[0]))
			.then((entries: Attribute[]) => itemData.attributes = entries)
			.catch((e: any) => {
				throw "Error during metadata-extraction: " + e;
			})
			.then(() => itemData);

		// return this.exifHandler.open()
		// 	.then(handler => {
		// 		return handler
		// 			.readMetadata(itemData.sourceFilepath)
		// 			.then((data: any) => this.flatten(data.data[0]))
		// 			.then((entries: Attribute[]) => itemData.attributes = entries)
		// 			.then(() => handler.close())
		// 			.catch((e: any) => {
		// 				handler.close();
		// 				throw "Error during metadata-extraction: " + e;
		// 			})
		// 			.then(() => itemData);
		// 	});


		// return this.exifHandler.open()
		// 	.readMetadata(itemData.sourceFilepath)
		// 	.then((data: any) => this.flatten(data.data[0]))
		// 	.then((entries: Attribute[]) => itemData.attributes = entries)
		// 	.then(() => this.exifHandler.close())
		// 	.catch((e: any) => {
		// 		this.exifHandler.close();
		// 		throw "Error during metadata-extraction: " + e;
		// 	})
		// 	.then(() => itemData);
	}


	private flatten(obj: any): Attribute[] {
		const map: Attribute[] = [];
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				map.push(...this.attributes(key, obj[key]));
			}
		}
		return map;
	}


	private attributes(key: string, value: any): Attribute[] {
		if (Array.isArray(value)) {
			return [this.attribList(key, value)];
		} else if ((typeof value) == "object") {
			return this.attribObject(key, value);
		} else {
			return [this.attribValue(key, value)];
		}
	}


	private attribList(key: string, values: any[]): Attribute {
		return {
			key: key,
			value: values.map(v => "" + v),
			type: "list",
			modified: false
		};
	}


	private attribObject(key: string, value: any): Attribute[] {
		return this.flatten(value)
			.map((flat: Attribute) => ({
				key: key + "." + flat.key,
				value: flat.value,
				type: flat.type,
				modified: false
			}));
	}


	private attribValue(key: string, value: any): Attribute {
		const type = valueToAttributeType(value);
		return {
			key: key,
			value: stringToAttributeValue(value === null || value === undefined ? null : "" + value, type),
			type: type,
			modified: false
		};
	}

}
