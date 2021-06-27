import {ItemData} from "../../../common/commonModels";

const exiftool = require('node-exiftool');
const exiftoolProcess = new exiftool.ExiftoolProcess();

export class ImportStepMetadata {

	public handle(itemData: ItemData): Promise<ItemData> {
		return this.printExifData(itemData.sourceFilepath)
			.then(() => itemData);
	}

	private async printExifData(filepath: string): Promise<void> {
		await exiftoolProcess
			.open()
			.then((pid: any) => console.log('Started exiftool process %s', pid))
			.then(() => exiftoolProcess.readMetadata(filepath, ['-File:all']))
			.then(console.log, console.error)
			.then(() => exiftoolProcess.close())
			.then(() => console.log('Closed exiftool'))
			.catch(console.error);
	}

}
