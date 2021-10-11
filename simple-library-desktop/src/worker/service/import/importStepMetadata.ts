import {ItemData} from "./importService";
import {ActionGetExiftoolInfo} from "../config/actionGetExiftoolInfo";
import {Attribute} from "../item/itemCommon";
import {iterateObj} from "../../../common/utils";

const exiftool = require("node-exiftool");

export class ImportStepMetadata {

	private readonly EXIFTOOL_OPTIONS = ["G0:1:2", "D", "d %Y-%m-%dT%H:%M:%S"];
	private exiftoolProcess: any;

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
			.then((data: any) => this.dataToAttributes(data.data[0]))
			.then((entries: Attribute[]) => itemData.attributes = entries)
			.then(() => this.exiftoolProcess.close())
			.catch((e: any) => {
				this.exiftoolProcess.close();
				throw "Error during metadata-extraction: " + e;
			})
			.then(() => itemData);
	}


	private dataToAttributes(obj: any): Attribute[] {
		const attributes: Attribute[] = [];
		iterateObj(obj, (key, value) => attributes.push(this.entryToAttribute(key, value)));
		return attributes;
	}


	private entryToAttribute(key: string, entry: any): Attribute {
		const groups = key.split(":");
		const value = entry.val;
		const id = entry.id;
		return {
			key: {
				id: id,
				name: this.findGroup(groups, 3),
				g0: this.findGroup(groups, 0),
				g1: this.findGroup(groups, 1),
				g2: this.findGroup(groups, 2)
			},
			value: (value === null || value === undefined) ? null : "" + value,
			type: "?",
			modified: false
		};
	}


	private findGroup(groups: string[], groupNum: number): string | null {
		if (!groups || groups.length === 0) {
			return null;
		} else if (groups.length === 4) {
			return groups[groupNum];
		} else {
			let groupsFilled: string[] = groups;
			while (groupsFilled.length < 4) {
				groupsFilled = [groupsFilled[0], ...groupsFilled];
			}
			return groupsFilled[groupNum];
		}
	}

}
