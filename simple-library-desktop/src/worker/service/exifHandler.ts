import {ActionGetExiftoolInfo} from "./config/actionGetExiftoolInfo";

const exiftool = require("node-exiftool");

export class ExifHandler {

	private readonly EXIFTOOL_OPTIONS = ["g", "d %Y-%m-%dT%H:%M:%S"];

	exiftoolProcess: any;

	constructor(actionGetExiftoolInfo: ActionGetExiftoolInfo, openImmediately: boolean) {
		this.exiftoolProcess = ExifHandler.createExiftoolProcess(actionGetExiftoolInfo);
		if (openImmediately) {
			this.open();
		}
	}

	private static createExiftoolProcess(actionGetExiftoolInfo: ActionGetExiftoolInfo): any {
		return new exiftool.ExiftoolProcess(actionGetExiftoolInfo.perform().defined ? actionGetExiftoolInfo.perform().location : "");
	}

	public open(): ExifHandler {
		if (this.exiftoolProcess) {
			this.exiftoolProcess.open();
			return this;
		} else {
			throw "Can`t open exiftool: exiftoolProcess missing.";
		}

	}

	public close(): Promise<void> {
		if (this.exiftoolProcess) {
			return this.exiftoolProcess.close();
		} else {
			throw "Can`t close exiftool: exiftoolProcess missing.";
		}
	}

	public getProcess(): any {
		return this.exiftoolProcess;
	}

	public readMetadata(filepath: string): Promise<any> {
		return Promise.resolve(this.readMetadataSync(filepath));
	}

	public readMetadataSync(filepath: string): any {
		return this.exiftoolProcess.readMetadata(filepath, this.EXIFTOOL_OPTIONS);
	}

	public writeMetadata(filepath: string, replaceAll: boolean, overwrite: boolean, data: any): Promise<void> {
		return Promise.resolve()
			.then(() => this.writeMetadataSync(filepath, replaceAll, overwrite, data));
	}

	public writeMetadataSync(filepath: string, replaceAll: boolean, overwrite: boolean, data: any): void {
		const options: string[] = [
			"codedcharacterset=utf8",
			"charset filename=utf8"
		];
		if (overwrite) {
			options.push("overwrite_original");
		}
		this.exiftoolProcess.writeMetadata(
			filepath,
			{
				all: replaceAll ? "" : undefined,
				...data
			},
			options
		);
	}

}
