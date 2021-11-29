import {ActionGetExiftoolInfo} from "./config/actionGetExiftoolInfo";

const exiftool = require("node-exiftool");

export class ExifHandler {

	private readonly EXIFTOOL_OPTIONS_WRITE: string[] = ["overwrite_original"];
	private readonly EXIFTOOL_OPTIONS_WRITE_NO_OVERWRITE: string[] = [];
	private readonly EXIFTOOL_OPTIONS_READ: string[] = ["G0:1:2", "D", "d %Y-%m-%dT%H:%M:%S"];

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
			.then(() => this.exiftoolProcess.readMetadata(filepath, this.EXIFTOOL_OPTIONS_READ))
			.then((data: any) => {
				console.log("exiftool read result:", data);
				return data;
			})
			.finally(() => this.exiftoolProcess.close());
	}


	public writeMetadata(filepath: string, metadata: object, preventOverwrite?: boolean): Promise<undefined | string> {
		const options = preventOverwrite === true ? this.EXIFTOOL_OPTIONS_WRITE_NO_OVERWRITE : this.EXIFTOOL_OPTIONS_WRITE;
		return this.exiftoolProcess
			.open()
			.then(() => this.exiftoolProcess.writeMetadata(filepath, {...metadata}, options, false))
			.then((res: any) => {
				if (res && res.error) {
					console.log("exiftool write result (preventOverwrite="+preventOverwrite+"):", JSON.stringify(res.error));
					return res.error;
				} else {
					return undefined;
				}
			})
			.then((res: any) => {
				this.exiftoolProcess.close();
				return res;
			})
			.catch((err: any) => console.error("error while closing exiftool:", err));
	}

}