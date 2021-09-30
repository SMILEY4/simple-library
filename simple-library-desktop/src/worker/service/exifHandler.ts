import {ActionGetExiftoolInfo} from "./config/actionGetExiftoolInfo";

const exiftool = require("node-exiftool");

export class ExifHandler {

	private readonly EXIFTOOL_OPTIONS = ["g", "d %Y-%m-%dT%H:%M:%S"];

	exiftoolProcess: any;

	constructor(actionGetExiftoolInfo: ActionGetExiftoolInfo) {
		this.exiftoolProcess = ExifHandler.createExiftoolProcess(actionGetExiftoolInfo);

	}


	private static createExiftoolProcess(actionGetExiftoolInfo: ActionGetExiftoolInfo): any {
		return new exiftool.ExiftoolProcess(actionGetExiftoolInfo.perform().defined ? actionGetExiftoolInfo.perform().location : "");
	}


	public readMetadata(filepath: string): Promise<any> {
		return this.exiftoolProcess
			.open()
			.then(() => this.exiftoolProcess.readMetadata(filepath, this.EXIFTOOL_OPTIONS))
			.finally(() => this.exiftoolProcess.close());
	}


	public writeMetadata(filepath: string, metadata: object): Promise<any> {
		return this.exiftoolProcess
			.open()
			.then(() => this.exiftoolProcess.writeMetadata(filepath, {...metadata}, ['overwrite_original'], false))
			.then(console.log, console.error)
			.then(() => this.exiftoolProcess.close())
			.catch(console.error);
	}

}
