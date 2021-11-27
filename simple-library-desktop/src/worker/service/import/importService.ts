import {ImportDataValidator} from "./importDataValidator";
import {ImportStepFileHash} from "./importStepFileHash";
import {ImportStepThumbnail} from "./importStepThumbnail";
import {ImportStepTargetFilepath} from "./importStepTargetFilepath";
import {ImportStepImportTarget} from "./importStepImportTarget";
import {ImportStepMetadata} from "./importStepMetadata";
import {Attribute, attributeKeysEquals} from "../item/itemCommon";
import {ImportStatusDTO} from "../../../common/events/dtoModels";
import {DataRepository} from "../dataRepository";
import {ActionGetLibraryAttributeMetaByKeys} from "../library/actionGetLibraryAttributeMetaByKeys";
import {AttributeMeta} from "../library/libraryCommons";

export interface ImportProcessData {
	files: string[],
	importTarget: ImportFileTarget,
	renameInstructions: BulkRenameInstruction,
}

export interface ImportFileTarget {
	action: ImportTargetAction,
	targetDir: string
}

export type ImportTargetAction = "keep" | "move" | "copy"

export interface BulkRenameInstruction {
	doRename: boolean,
	parts: RenamePart[]
}

export interface RenamePart {
	type: RenamePartType,
	value: string
}

export type RenamePartType = "nothing" | "text" | "number_from" | "original_filename";

export interface ImportResult {
	timestamp: number,
	amountFiles: number,
	failed: boolean,
	failureReason: string,
	encounteredErrors: boolean,
	filesWithErrors: ([string, string])[]
}

export interface ImportContext {
	running: boolean,
	data: ImportProcessData,
	startTimestamp: number,
	failureReason: string | null,
	errors: ([string, string])[]
}

export interface ItemData {
	timestamp: number,
	filepath: string,
	sourceFilepath: string,
	hash: string,
	thumbnail: string,
	attributes?: Attribute[]
}

export type ImportStatusSender = (status: ImportStatusDTO) => Promise<void>;

export class ImportService {

	private readonly repository: DataRepository;
	private readonly validator: ImportDataValidator;
	private readonly importStepFileHash: ImportStepFileHash;
	private readonly importStepThumbnail: ImportStepThumbnail;
	private readonly importStepTargetFilepath: ImportStepTargetFilepath;
	private readonly importStepImportTarget: ImportStepImportTarget;
	private readonly importStepMetadata: ImportStepMetadata;
	private readonly importStatusSender: ImportStatusSender;
	private readonly actionGetAttributeMetaByKeys: ActionGetLibraryAttributeMetaByKeys;

	/**
	 * True, when an import is currently running
	 */
	private importRunning: boolean = false;


	constructor(
		repository: DataRepository,
		validator: ImportDataValidator,
		importStepFileHash: ImportStepFileHash,
		importStepThumbnail: ImportStepThumbnail,
		importStepTargetFilepath: ImportStepTargetFilepath,
		importStepImportTarget: ImportStepImportTarget,
		importStepMetadata: ImportStepMetadata,
		importStatusSender: ImportStatusSender,
		actionGetAttributeMetaByKeys: ActionGetLibraryAttributeMetaByKeys
	) {
		this.repository = repository;
		this.validator = validator;
		this.importStepFileHash = importStepFileHash;
		this.importStepThumbnail = importStepThumbnail;
		this.importStepTargetFilepath = importStepTargetFilepath;
		this.importStepImportTarget = importStepImportTarget;
		this.importStepMetadata = importStepMetadata;
		this.importStatusSender = importStatusSender;
		this.actionGetAttributeMetaByKeys = actionGetAttributeMetaByKeys;
	}


	public isImportRunning(): boolean {
		return this.importRunning;
	}


	public import(data: ImportProcessData): Promise<ImportResult> {
		return this.tryStartImport(data)
			.then((ctx) => this.validate(ctx))
			.then(ctx => this.importFiles(ctx))
			.catch(err => {
				if (this.isContext(err)) {
					return err as ImportContext;
				} else {
					throw err;
				}
			})
			.then((ctx) => this.finishImport(ctx));
	}


	private tryStartImport(data: ImportProcessData): Promise<ImportContext> {
		if (this.importRunning) {
			return Promise.reject(this.buildContextAlreadyRunning(data));
		} else {
			this.importRunning = true;
			console.log("starting import-process of " + data.files.length + " files.");
			return Promise.resolve(this.buildContext(data));
		}
	}


	private validate(context: ImportContext): Promise<ImportContext> {
		try {
			this.validator.validate(context.data);
			return Promise.resolve(context);
		} catch (err) {
			context.failureReason = "Invalid data: " + err;
			return Promise.reject(context);
		}
	}


	private async importFiles(context: ImportContext): Promise<ImportContext> {
		const files = context.data.files;
		const amountFiles = files.length;
		for (let i = 0; i < amountFiles; i++) {
			await Promise.resolve(files[i])
				.then((currentFile: string) => this.importFile(i, currentFile, context.data))
				.catch(([file, error]) => context.errors.push([file, error.toString()]))
				.then(() => this.sendImportStatus(i + 1, amountFiles));
		}
		return context;
	}


	private importFile(importIndex: number, file: string, data: ImportProcessData): Promise<any> {
		return Promise.resolve()
			.then(() => console.log("importing file: " + file))
			.then(() => this.buildBaseItemData(file))
			.then((item: ItemData) => this.importStepTargetFilepath.handle(item, data.importTarget, data.renameInstructions, importIndex))
			.then((item: ItemData) => this.importStepImportTarget.handle(item, data.importTarget.action))
			.then((item: ItemData) => this.importStepFileHash.handle(item))
			.then((item: ItemData) => this.importStepThumbnail.handle(item))
			.then((item: ItemData) => this.importStepMetadata.handle(item))
			.then((item: ItemData) => this.saveItem(item))
			.then(() => console.debug("done importing file: " + file))
			.catch((error: any) => {
				console.error("Error while importing file " + file + ": " + error);
				throw [file, error];
			});
	}


	private saveItem(item: ItemData): Promise<any> {
		return this.insertItem(item)
			.then((itemId: number) => item.attributes
				? this.insertAttributes(itemId, item.attributes)
				: Promise.resolve(null)
			);
	}


	private insertItem(item: ItemData): Promise<number | null> {
		return this.repository.insertItem(item.filepath, item.timestamp, item.hash, item.thumbnail)
			.then((itemId: number | null) => itemId
				? itemId
				: Promise.reject("Could not save item: " + item.filepath));
	}


	private insertAttributes(itemId: number, attributes: Attribute[]): Promise<any> {
		return this.actionGetAttributeMetaByKeys.perform(attributes.map(a => a.key))
			.then(attributeMeta => {
				return attributes
					.map(attribute => this.enrichWithAttributeId(attribute, attributeMeta))
					.filter(a => a !== null);
			})
			.then(attribEntries => this.repository.insertItemAttributes(itemId, attribEntries));
	}


	private enrichWithAttributeId(attribute: Attribute, attributeMeta: AttributeMeta[]): { attId: number, value: string, modified: boolean } | null {
		const metaEntry = attributeMeta.find(am => attributeKeysEquals(am.key, attribute.key));
		if (metaEntry) {
			return {
				attId: metaEntry.attId,
				value: "" + attribute.value,
				modified: false
			};
		} else {
			return null;
		}
	}


	private sendImportStatus(amountImported: number, amountTotal: number): Promise<void> {
		return this.importStatusSender({
			totalAmountFiles: amountTotal,
			completedFiles: amountImported
		});
	}


	private finishImport(context: ImportContext): ImportResult {
		if (context.running) {
			this.importRunning = false;
		}
		return this.buildResult(context);
	}


	private buildContext(data: ImportProcessData): ImportContext {
		return {
			running: true,
			data: data,
			startTimestamp: Date.now(),
			failureReason: null,
			errors: []
		};
	}


	private buildContextAlreadyRunning(data: ImportProcessData): ImportContext {
		return {
			running: false,
			data: data,
			startTimestamp: Date.now(),
			failureReason: "Can not start import while another import is already running.",
			errors: []
		};
	}

	private isContext(obj: any): boolean {
		return "running" in obj
			&& "data" in obj
			&& "startTimestamp" in obj
			&& "failureReason" in obj
			&& "errors" in obj;
	}

	private buildResult(context: ImportContext): ImportResult {
		return {
			timestamp: context.startTimestamp,
			amountFiles: context.data.files.length,
			failed: context.failureReason !== null,
			failureReason: context.failureReason ? context.failureReason : "",
			encounteredErrors: context.errors && context.errors.length > 0,
			filesWithErrors: context.errors
		};
	}

	private buildBaseItemData(filepath: string) {
		return {
			timestamp: Date.now(),
			sourceFilepath: filepath,
			filepath: filepath
		};
	}

}
