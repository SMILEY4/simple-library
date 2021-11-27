import {Attribute} from "./itemCommon";
import {iterateObj} from "../../../common/utils";
import {ActionGetExiftoolInfo} from "../config/actionGetExiftoolInfo";
import {ExifHandler} from "../exifHandler";

/**
 * Read the file metadata and return as attributes
 */
export class ActionReadItemAttributesFromFile {

	private readonly exifHandler: ExifHandler;

	constructor(actionGetExiftoolInfo: ActionGetExiftoolInfo) {
		this.exifHandler = new ExifHandler(actionGetExiftoolInfo);
	}


	public perform(filepath: string): Promise<Attribute[]> {
		return this.exifHandler
			.readMetadata(filepath)
			.then((data: any) => this.dataToAttributes(data.data[0]));
	}


	private dataToAttributes(obj: any): Attribute[] {
		const attributes: Attribute[] = [];
		iterateObj(obj, (key, value) => attributes.push(this.entryToAttribute(key, value)));
		return attributes;
	}


	private entryToAttribute(key: string, entry: any): Attribute {
		const groups = key.split(":");
		const value = entry.val;
		const id = ""+entry.id;
		return {
			attId: null,
			key: {
				id: id ? id : this.findGroup(groups, 3),
				name: this.findGroup(groups, 3),
				g0: this.findGroup(groups, 0),
				g1: this.findGroup(groups, 1),
				g2: this.findGroup(groups, 2)
			},
			value: (value === null || value === undefined) ? null : "" + value,
			modified: false,
			writable: undefined,
			type: undefined
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
