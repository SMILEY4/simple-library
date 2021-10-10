import {ReadStream, Stats} from "fs";

const fs = require("fs");
const fsp = fs.promises;
const shell = require("electron").shell;

export class FileSystemWrapper {

	/**
	 * Moves the given file to the given destination
	 * @param source the path of the file to move
	 * @param target the path of the destination file
	 * @param allowOverwrite whether to allow an existing file at the target to be overwritten. Fails if 'false' and target already exists.
	 * @return a promise that resolves with the target filepath
	 */
	public move(source: string, target: string, allowOverwrite: boolean): Promise<string> {
		if (allowOverwrite) {
			return fsp.rename(source, target)
				.then(() => target);
		} else {
			if (!this.exists(target)) {
				return fsp.rename(source, target)
					.then(() => target);
			} else {
				throw "Can not move " + source + " to " + target + ": target already exists";
			}
		}
	}

	/**
	 * Copies the given file to the given destination
	 * @param source the path of the file to copy
	 * @param target the path of the destination file
	 * @param allowOverwrite whether to allow an existing file at the target to be overwritten. Fails if 'false' and target already exists.
	 * @return a promise that resolves with the target filepath
	 */
	public copy(source: string, target: string, allowOverwrite: boolean): Promise<string> {
		const mode: number = allowOverwrite ? 0 : fs.constants.COPYFILE_EXCL;
		return fsp.copyFile(source, target, mode)
			.then(() => target);
	}

	/**
	 * Opens a {@link ReadStream} from the given file
	 * @param filepath the path of the file to read
	 * @return the created stream
	 */
	public createReadStream(filepath: string): ReadStream {
		return fs.createReadStream(filepath);
	}

	/**
	 * Reads a file and returns the content as a string (utf8)
	 * @param filepath the path of the file to read
	 * @return the content of the file
	 */
	public readFile(filepath: string): string {
		return fs.readFileSync(filepath, "utf8");
	}

	/**
	 * Checks whether the given file exists (sync)
	 * @param path the path to the file
	 * @return true if the file at the given path exists and is a file
	 */
	public existsFile(path: string): boolean {
		try {
			const stats: Stats = fs.statSync(path);
			return stats.isFile();
		} catch (e) {
			return false;
		}
	}

	/**
	 * Checks whether the given directory exists (sync)
	 * @param path the path to the directory
	 * @return true if the directory at the given path exists and is a directory
	 */
	public existsDir(path: string): boolean {
		try {
			const stats: Stats = fs.statSync(path);
			return stats.isDirectory();
		} catch (e) {
			return false;
		}
	}

	/**
	 * Checks whether the given file or directory exists (sync)
	 * @param path the path to the file/directory
	 * @return true if the file/directory at the given path exists and is a file or directory
	 */
	public exists(path: string): boolean {
		try {
			const stats: Stats = fs.statSync(path);
			return stats.isDirectory() || stats.isFile();
		} catch (e) {
			return false;
		}
	}

	/**
	 * Opens the given file with the system default application
	 * @param path the path to the file to open
	 */
	public open(path: string): Promise<void> {
		return shell.openPath(path).then();
	}

}