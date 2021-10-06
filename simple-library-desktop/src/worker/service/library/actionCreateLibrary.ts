import path from "path";
import {FileSystemWrapper} from "../fileSystemWrapper";
import {LibraryFileHandle} from "./libraryCommons";
import {DataRepository} from "../dataRepository";
import {AttributeMetadata} from "../../persistence/attributeMetadata";

/**
 * Create (and "open") a new library with the given name in the given directory.
 */
export class ActionCreateLibrary {

	private readonly repository: DataRepository;
	private readonly fsWrapper: FileSystemWrapper;
	private readonly isDev: boolean;

	constructor(repository: DataRepository, fsWrapper: FileSystemWrapper, isDev?: boolean) {
		this.repository = repository;
		this.fsWrapper = fsWrapper;
		this.isDev = isDev || isDev === undefined || isDev === null;
	}


	public perform(name: string, targetDir: string, createDefaultCollection: boolean): Promise<LibraryFileHandle> {
		const filepath: string = this.toFilePath(targetDir, name);
		if (this.doesFileExist(filepath)) {
			return this.resultFileAlreadyExists(filepath);
		} else {
			return this.create(filepath)
				.then(() => this.initLibrary(name, createDefaultCollection))
				.then(() => this.insertStaticTagData())
				.then(() => this.resultCreated(filepath, name))
		}
	}

	private toFilePath(dir: string, name: string): string {
		const filename: string = name
			// remove whitespaces
			.replace(/\s/g, "")
			// remove everything except characters or numbers
			.replace(/[^a-zA-Z0-9]/g, "");
		return path.join(dir, filename + ".db");
	}


	private doesFileExist(filepath: string): boolean {
		return this.fsWrapper.existsFile(filepath);
	}


	private create(filepath: string): Promise<any> {
		console.log("Creating new library: " + filepath);
		return this.repository.open(filepath, true);
	}


	private initLibrary(name: string, createDefaultCollection: boolean): Promise<any> {
		return this.repository.init(name, createDefaultCollection);
	}


	private async insertStaticTagData(): Promise<any> {
		const blocks: (AttributeMetadata.AttribMetaEntry[])[] = [];
		AttributeMetadata.getDataAsBlocks(this.fsWrapper, this.isDev, 25, block => blocks.push(block));
		for (let block of blocks) {
			await this.repository.insertAttributeMeta(block);
		}
	}


	private resultFileAlreadyExists(filepath: string): Promise<LibraryFileHandle> {
		console.log("Could not create library. File already exists: " + filepath);
		return Promise.reject("File with the same name already exists (" + filepath + ").");
	}


	private resultCreated(filepath: string, name: string) {
		return {
			path: filepath,
			name: name
		};
	}

}
