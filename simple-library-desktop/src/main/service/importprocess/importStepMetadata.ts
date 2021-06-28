import {ItemData, MetadataEntry, MetadataEntryType} from "../../../common/commonModels";
import {ConfigDataAccess} from "../../persistence/configDataAccess";

const exiftool = require('node-exiftool');

export class ImportStepMetadata {

	exiftoolProcess: any;

	constructor(configDataAccess: ConfigDataAccess) {
		this.exiftoolProcess = new exiftool.ExiftoolProcess(configDataAccess.getExiftoolLocation());
	}

	public handle(itemData: ItemData): Promise<ItemData> {
		return this.exiftoolProcess
			.open()
			.then(() => this.exiftoolProcess.readMetadata(itemData.sourceFilepath, ['g', 'd %Y-%m-%dT%H:%M:%S']))
			.then((data: any) => this.flatten(data.data[0]))
			.then((entries: MetadataEntry[]) => itemData.metadataEntries = entries)
			.catch(() => this.exiftoolProcess.close())
			.then(() => this.exiftoolProcess.close())
			.then(() => itemData);
	}

	private flatten(obj: any): MetadataEntry[] {
		const map: MetadataEntry[] = []

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
				map.push(...this.flatten(value).map((flat: MetadataEntry) => ({
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

	private static extractType(value: any): MetadataEntryType  {
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
