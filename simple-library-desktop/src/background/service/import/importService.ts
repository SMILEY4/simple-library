import {DbAccess} from "../../persistence/dbAcces";
import {ImportProcessData} from "../../../common/commonModels";
import {ImportDataValidator} from "./importDataValidator";
import {ImportStepFileHash} from "./importStepFileHash";
import {ImportStepThumbnail} from "./importStepThumbnail";
import {ImportStepRename} from "./importStepRename";
import {ImportStepImportTarget} from "./importStepImportTarget";
import {ImportStepMetadata} from "./importStepMetadata";
import {SQL} from "../../persistence/sqlHandler";
import {ItemsImportStatusChannel} from "../../../common/messaging/channels/channels";
import {voidThen} from "../../../common/AsyncCommon";
import {ItemCommon} from "../item/itemCommon";
import Attribute = ItemCommon.Attribute;

export interface ImportResult {
	timestamp: number,
	amountFiles: number,
	failed: boolean,
	failureReason: string,
	encounteredErrors: boolean,
	filesWithErrors: ([string, string])[]
}

export interface ItemData {
	timestamp: number,
	filepath: string,
	sourceFilepath: string,
	hash: string,
	thumbnail: string,
	attributes?: Attribute[]
}

export class ImportService {

	private readonly dbAccess: DbAccess;
	private readonly validator: ImportDataValidator;
	private readonly importStepFileHash: ImportStepFileHash;
	private readonly importStepThumbnail: ImportStepThumbnail;
	private readonly importStepRename: ImportStepRename;
	private readonly importStepImportTarget: ImportStepImportTarget;
	private readonly importStepMetadata: ImportStepMetadata;
	private readonly channelImportStatus: ItemsImportStatusChannel;

	/**
	 * True, when an import is currently running
	 */
	private importRunning: boolean = false;


	constructor(
		dbAccess: DbAccess,
		validator: ImportDataValidator,
		importStepFileHash: ImportStepFileHash,
		importStepThumbnail: ImportStepThumbnail,
		importStepRename: ImportStepRename,
		importStepImportTarget: ImportStepImportTarget,
		importStepMetadata: ImportStepMetadata,
		channelImportStatus: ItemsImportStatusChannel
	) {
		this.dbAccess = dbAccess;
		this.validator = validator;
		this.importStepFileHash = importStepFileHash;
		this.importStepThumbnail = importStepThumbnail;
		this.importStepRename = importStepRename;
		this.importStepImportTarget = importStepImportTarget;
		this.importStepMetadata = importStepMetadata;
		this.channelImportStatus = channelImportStatus;
	}

	/**
	 * Whether an import is currently running.
	 */
	public isImportRunning(): boolean {
		return this.importRunning;
	}

	/**
	 * Import the given data
	 */
	public async import(data: ImportProcessData): Promise<ImportResult> {
		if (this.importRunning) {
			return Promise.resolve(ImportService.resultAlreadyRunning(data.files.length));
		} else {
			this.importRunning = true;
			const totalAmountFiles: number = data.files.length;
			const importResult: ImportResult = ImportService.resultInProgress(totalAmountFiles);
			try {
				console.log("starting import-process of " + totalAmountFiles + " files.");
				this.validator.validate(data);
				for (let i = 0; i < totalAmountFiles; i++) {
					const currentFile: string = data.files[i];
					await Promise.resolve()
						.then(() => console.log("importing file: " + currentFile))
						.then(() => ImportService.buildBaseItemData(currentFile))
						.then((item: ItemData) => this.importStepRename.handle(item, data.importTarget, data.renameInstructions, i))
						.then((item: ItemData) => this.importStepImportTarget.handle(item, data.importTarget.action))
						.then((item: ItemData) => this.importStepFileHash.handle(item))
						.then((item: ItemData) => this.importStepThumbnail.handle(item))
						.then((item: ItemData) => this.importStepMetadata.handle(item))
						.then((item: ItemData) => this.saveItem(item))
						.then(() => console.log("done importing file: " + currentFile))
						.catch((error: any) => {
							console.error("Error while importing file " + currentFile + ": " + error);
							importResult.encounteredErrors = true;
							importResult.filesWithErrors.push([currentFile, error]);
						});
					this.channelImportStatus.sendAndForget({
						totalAmountFiles: totalAmountFiles,
						completedFiles: i + 1
					}).then();
				}
				console.log("import-process complete.");
			} catch (err) {
				importResult.failed = true;
				importResult.failureReason = JSON.stringify(err);
			} finally {
				this.importRunning = false;
			}
			return Promise.resolve(importResult);
		}
	}

	private saveItem(item: ItemData): Promise<void> {
		return this.dbAccess.run(SQL.insertItem(item.filepath, item.timestamp, item.hash, item.thumbnail))
			.then((itemId: number | null) => itemId ? itemId : Promise.reject("Could not save item: " + item.filepath))
			.then((itemId: number) => {
				if (item.attributes) {
					return this.dbAccess.run(SQL.insertItemAttributes(itemId, item.attributes.map(att => ({
						key: att.key,
						value: att.value,
						type: att.type
					}))));
				}
			})
			.then(voidThen);
	}

	private static resultAlreadyRunning(amountFiles: number): ImportResult {
		return {
			timestamp: Date.now(),
			amountFiles: amountFiles,
			failed: true,
			failureReason: "Can not start import while another import is already running.",
			encounteredErrors: false,
			filesWithErrors: []
		};
	}

	private static resultInProgress(totalAmountFiles: number): ImportResult {
		return {
			timestamp: Date.now(),
			amountFiles: totalAmountFiles,
			failed: false,
			failureReason: "",
			encounteredErrors: false,
			filesWithErrors: []
		};
	}

	private static buildBaseItemData(filepath: string) {
		return {
			timestamp: Date.now(),
			sourceFilepath: filepath,
			filepath: filepath
		};
	}

}