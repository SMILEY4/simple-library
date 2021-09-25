import {ItemData} from "./importService";
import {ActionGetExiftoolInfo} from "../config/actionGetExiftoolInfo";
import {Attribute, stringToAttributeValue, valueToAttributeType} from "../item/itemCommon";

const exiftool = require("node-exiftool");

export class ImportStepMetadata {

	private readonly EXIFTOOL_OPTIONS = ["g", "d %Y-%m-%dT%H:%M:%S"];

	exiftoolProcess: any;

	constructor(actionGetExiftoolInfo: ActionGetExiftoolInfo) {
		this.exiftoolProcess = ImportStepMetadata.createExiftoolProcess(actionGetExiftoolInfo);
	}


	private static createExiftoolProcess(actionGetExiftoolInfo: ActionGetExiftoolInfo): any {
		return new exiftool.ExiftoolProcess(actionGetExiftoolInfo.perform().defined ? actionGetExiftoolInfo.perform().defined : "");
	}


	public handle(itemData: ItemData): Promise<ItemData> {
		return this.exiftoolProcess
			.open()
			.then(() => this.exiftoolProcess.readMetadata(itemData.sourceFilepath, this.EXIFTOOL_OPTIONS))
			.then((data: any) => this.flatten(data.data[0]))
			.then((entries: Attribute[]) => itemData.attributes = entries)
			.then(() => this.exiftoolProcess.close())
			.catch((e: any) => {
				this.exiftoolProcess.close();
				throw "Error during metadata-extraction: " + e;
			})
			.then(() => itemData);
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
			type: "list"
		};
	}


	private attribObject(key: string, value: any): Attribute[] {
		return this.flatten(value)
			.map((flat: Attribute) => ({
				key: key + "." + flat.key,
				value: flat.value,
				type: flat.type
			}));
	}


	private attribValue(key: string, value: any) {
		const type = valueToAttributeType(value);
		return {
			key: key,
			value: stringToAttributeValue(value === null || value === undefined ? null : "" + value, type),
			type: type
		};
	}

}
