import {DataRepository} from "../dataRepository";
import {ActionGetExiftoolInfo} from "../config/actionGetExiftoolInfo";
import {ExtendedAttribute, rowToExtendedAttribute} from "./itemCommon";
import {FileSystemWrapper} from "../fileSystemWrapper";
import {EmbedStatusDTO} from "../../../common/events/dtoModels";
import {ExifHandler} from "../exifHandler";

export interface EmbedReport {
	amountProcessedItems: number,
	errors: ({ itemId: number, filepath: string, error: string })[]
}

export type EmbedStatusSender = (status: EmbedStatusDTO) => Promise<void>;

/**
 * write the attributes of the given items into their files.
 */
export class ActionEmbedItemAttributes {

	private readonly actionGetExiftoolInfo: ActionGetExiftoolInfo;
	private readonly fsWrapper: FileSystemWrapper;
	private readonly repository: DataRepository;
	private readonly embedStatusSender: EmbedStatusSender;


	constructor(actionGetExiftoolInfo: ActionGetExiftoolInfo,
				fsWrapper: FileSystemWrapper,
				repository: DataRepository,
				embedStatusSender: EmbedStatusSender
	) {
		this.actionGetExiftoolInfo = actionGetExiftoolInfo;
		this.fsWrapper = fsWrapper;
		this.repository = repository;
		this.embedStatusSender = embedStatusSender;
	}


	public perform(itemIds: number[] | null, allAttributes: boolean): Promise<EmbedReport> {
		return this.getItemAttributes(itemIds, !allAttributes)
			.then(attribs => this.attributesToMetadataGroups(attribs))
			.then(itemGroups => this.embedItems(itemGroups))
			.then(report => this.clearModifiedFlags(report, itemIds));
	}


	private getItemAttributes(itemIds: number[] | null, onlyModified: boolean): Promise<ExtendedAttribute[]> {
		const rows: Promise<any[]> = itemIds === null
			? this.repository.getAllExtendedItemAttributes(onlyModified)
			: this.repository.getExtendedItemAttributesByItemIds(itemIds, onlyModified);
		return rows
			.then(rows => rows.map(row => rowToExtendedAttribute(row)));
	}


	private attributesToMetadataGroups(attributes: ExtendedAttribute[]): ({ itemId: number, filepath: string, metadata: object })[] {
		return attributes.reduce((collector, attr, index) => {
				if (collector.currentId === attr.itemId) {
					collector.currentItemAttribs.push(attr);
				} else {
					if (collector.currentItemAttribs.length > 0) {
						collector.items.push({
							itemId: collector.currentId,
							filepath: collector.currentFilepath,
							metadata: this.attributesToMetadataObj(collector.currentItemAttribs)
						});
					}
					collector.currentId = attr.itemId;
					collector.currentFilepath = attr.filepath;
					collector.currentItemAttribs = [attr];
				}
				if (index == attributes.length - 1) {
					collector.items.push({
						itemId: collector.currentId,
						filepath: collector.currentFilepath,
						metadata: this.attributesToMetadataObj(collector.currentItemAttribs)
					});
				}
				return collector;
			},
			{
				currentId: null,
				currentFilepath: "",
				currentItemAttribs: [],
				items: []
			}
		).items;
	}


	private attributesToMetadataObj(attributes: ExtendedAttribute[]): object {
		return attributes.reduce((metadataObj, attr) => {
			const keyName = attr.key.g0 + ":" + attr.key.g1 + ":" + attr.key.g2 + ":" + attr.key.name;
			(metadataObj as any)[keyName] = attr.value;
			return metadataObj;
		}, {});
	}


	private async embedItems(items: ({ itemId: number, filepath: string, metadata: object })[]): Promise<EmbedReport> {
		console.log("Start embedding attributes of " + items.length + " items.");
		const report: EmbedReport = {
			amountProcessedItems: items.length,
			errors: []
		};
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (this.fsWrapper.existsFile(item.filepath)) {
				await this.embedItem(item.filepath, item.metadata)
					.catch(err => {
						report.errors.push({
							itemId: item.itemId,
							filepath: item.filepath,
							error: "Error: " + err.toString()
						});
					});
			} else {
				report.errors.push({
					itemId: item.itemId,
					filepath: item.filepath,
					error: "File not found."
				});
			}
			await this.sendStatus(items.length, i + 1);
		}
		console.log("Finished embedding attributes of " + items.length + " items.");
		return report;
	}


	private embedItem(filepath: string, metadata: object): Promise<void> {
		return new ExifHandler(this.actionGetExiftoolInfo).writeMetadata(filepath, metadata).then((err) => {
			if (err) {
				throw new Error(err);
			}
		});
	}


	private sendStatus(totalAmount: number, completedAmount: number): Promise<void> {
		return this.embedStatusSender({
			totalAmountItems: totalAmount,
			completedItems: completedAmount
		});
	}


	private async clearModifiedFlags(report: EmbedReport, itemIds: number[] | null): Promise<EmbedReport> {
		if (itemIds) {
			return this.repository.clearItemAttributeModifiedFlagsByItemIds(itemIds)
				.then(() => report)
				.catch((e) => {
					report.errors.push({
						itemId: null,
						filepath: null,
						error: "Error clearing modified flags: " + e
					});
					return report;
				});
		} else {
			return this.repository.clearItemAttributeModifiedFlagsAll()
				.then(() => report)
				.catch((e) => {
					report.errors.push({
						itemId: null,
						filepath: null,
						error: "Error clearing all modified flags: " + e
					});
					return report;
				});
		}
	}

}