import {DataRepository} from "../dataRepository";
import {ActionGetExiftoolInfo} from "../config/actionGetExiftoolInfo";
import {ExifHandler} from "../exifHandler";
import {ExtendedAttribute, rowToExtendedAttribute} from "./itemCommon";
import {FileSystemWrapper} from "../fileSystemWrapper";

/**
 * write the attributes of the given items into their files.
 */
export class ActionEmbedItemAttributes {

	private readonly actionGetExiftoolInfo: ActionGetExiftoolInfo;
	private readonly fsWrapper: FileSystemWrapper;
	private readonly repository: DataRepository;


	constructor(actionGetExiftoolInfo: ActionGetExiftoolInfo, fsWrapper: FileSystemWrapper, repository: DataRepository) {
		this.actionGetExiftoolInfo = actionGetExiftoolInfo;
		this.fsWrapper = fsWrapper;
		this.repository = repository;
	}


	public perform(itemIds: number[] | null, allAttributes: boolean): Promise<void> {
		const exifHandler = new ExifHandler(this.actionGetExiftoolInfo, true);
		return this.getItemAttributes(itemIds, !allAttributes)
			.then(attribs => this.attributesToMetadataGroups(attribs))
			.then(itemGroups => this.embedItems(itemGroups, exifHandler))
			.finally(() => exifHandler.close());
	}


	private getItemAttributes(itemIds: number[] | null, onlyModified: boolean): Promise<ExtendedAttribute[]> {
		const rows: Promise<any[]> = itemIds === null
			? this.repository.getAllExtendedItemAttributes(onlyModified)
			: this.repository.getExtendedItemAttributesByItemIds(itemIds, onlyModified);
		return rows
			.then(rows => rows.map(row => rowToExtendedAttribute(row)));
	}


	private attributesToMetadataGroups(attributes: ExtendedAttribute[]): ({ itemId: number, filepath: string, metadata: object })[] {
		return attributes.reduce(
			(collector, attr, index) => {
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
			(metadataObj as any)[attr.key] = attr.value;
			return metadataObj;
		}, {});
	}


	private async embedItems(items: ({ itemId: number, filepath: string, metadata: object })[], exifHandler: ExifHandler): Promise<void> {
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (this.fsWrapper.existsFile(item.filepath)) {
				await this.embedItem(item.filepath, item.metadata, exifHandler);
			}
		}
	}

	private embedItem(filepath: string, metadata: object, exifHandler: ExifHandler): Promise<void> {
		return exifHandler.writeMetadata(filepath, false, true, metadata);
	}

}
