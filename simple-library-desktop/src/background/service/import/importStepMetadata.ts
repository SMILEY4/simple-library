import {ItemData} from "./importService";
import {Attribute, AttributeType} from "../itemService";
import {ActionGetExiftoolInfo} from "../config/actionGetExiftoolInfo";

const exiftool = require('node-exiftool');

export class ImportStepMetadata {

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
			.then(() => this.exiftoolProcess.readMetadata(itemData.sourceFilepath, ['g', 'd %Y-%m-%dT%H:%M:%S']))
			.then((data: any) => this.flatten(data.data[0]))
			.then((entries: Attribute[]) => itemData.attributes = entries)
			.catch(() => this.exiftoolProcess.close())
			.then(() => this.exiftoolProcess.close())
			.then(() => itemData);
	}

	private flatten(obj: any): Attribute[] {
		const map: Attribute[] = []

		for (let key in obj) {
			if (!obj.hasOwnProperty(key)) {
				continue;
			}
			const value = obj[key]

			if(Array.isArray(value)) {
				map.push({
					key: key,
					value: value.join(";"),
					type: "list"
				})

			} else if ((typeof value) == 'object') {
				map.push(...this.flatten(value).map((flat: Attribute) => ({
					key: key + "." + flat.key,
					value: flat.value,
					type: flat.type
				})))

			} else {
				map.push({
					key: key,
					value: value,
					type: ImportStepMetadata.extractType(value)
				})
			}

		}

		return map;
	}

	private static extractType(value: any): AttributeType  {
		const isISODate = !!(""+value).match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/);
		if(isISODate) {
			return "date"
		}
		switch (typeof(value)) {
			case "string": return "text"
			case "number": return "number"
			case "boolean": return "boolean"
		}
		return "text";
	}

}
