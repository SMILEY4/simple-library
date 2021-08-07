import {FileSystemWrapper} from "../fileSystemWrapper";
import {ImportTargetAction, ItemData} from "./importService";

export class ImportStepImportTarget {

	fsWrapper: FileSystemWrapper;

	constructor(fsWrapper: FileSystemWrapper) {
		this.fsWrapper = fsWrapper;
	}


	/**
	 * Moves/Copies the file as defined in the given action. The actual renaming of the file also happens here.
	 * @param itemData the data of the file/item
	 * @param action data about how to handle the file, i.e. keep, move or copy
	 * @return a promise that resolves with the given item data
	 */
	public handle(itemData: ItemData, action: ImportTargetAction): Promise<ItemData> {
		return Promise.resolve()
			.then(() => {
				switch (action) {
					case "keep":
						return this.keepFile(itemData.sourceFilepath, itemData.filepath);
					case "move":
						return this.moveFile(itemData.sourceFilepath, itemData.filepath);
					case "copy":
						return this.copyFile(itemData.sourceFilepath, itemData.filepath);
				}
			})
			.then(() => itemData);
	}


	private keepFile(sourceFilepath: string, targetFilepath: string): Promise<string> {
		if (sourceFilepath === targetFilepath || this.normalizePath(sourceFilepath) === this.normalizePath(targetFilepath)) {
			return Promise.resolve(targetFilepath);
		} else {
			return this.moveFile(sourceFilepath, targetFilepath);
		}
	}


	private moveFile(sourceFilepath: string, targetFilepath: string): Promise<string> {
		return this.fsWrapper.move(sourceFilepath, targetFilepath, false);
	}


	private copyFile(sourceFilepath: string, targetFilepath: string): Promise<string> {
		return this.fsWrapper.copy(sourceFilepath, targetFilepath, false);
	}

	private readonly REPLACE_ENTRIES: [RegExp, string][] = [
		[/\\/g, "/"],
		[/(\w):/, "/$1"],
		[/(\w+)\/\.\.\/?/g, ""],
		[/^\.\//, ""],
		[/\/\.\//, "/"],
		[/\/\.$/, ""],
		[/\/$/, ""]
	];

	private normalizePath(path: string): string {
		this.REPLACE_ENTRIES.forEach(entry => {
			while (entry[0].test(path)) {
				path = path.replace(entry[0], entry[1]);
			}
		});
		return path;
	}

}
