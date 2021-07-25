import {IpcWrapper} from "../core/ipcWrapper";
import {
	Collection,
	CollectionType,
	Group,
	ImportProcessData,
	ImportResult,
	ImportStatus,
	ItemData,
	LastOpenedLibraryEntry,
	LibraryMetadata,
	MetadataEntry
} from "../../commonModels";
import {Channel} from "../core/channel";

export type ComDir = "r" | "w";

export function proxyChannel(ipcWrapper: IpcWrapper, id: string, dirFrom?: ComDir, dirTo?: ComDir): void {
	const channelFrom = new Channel((dirFrom ? dirFrom : "r") + "." + id, ipcWrapper);
	const channelTo = new Channel((dirTo ? dirTo : "w") + "." + id, ipcWrapper);
	channelFrom.on((payload: any, traceId: string) => {
		return channelTo.send(payload, traceId + "-p").then((response) => response);
	});
}

export interface GetExiftoolDataPayload {
	location: string | null;
	defined: boolean;
}

export class ConfigOpenChannel extends Channel<void, void> {
	public static readonly ID: string = "config.open";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ConfigOpenChannel.ID, ipcWrapper);
		this.setShouldVoidResult(true);
	}
}

export class ConfigGetExiftoolChannel extends Channel<void, GetExiftoolDataPayload> {
	public static readonly ID: string = "config.exiftool.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ConfigGetExiftoolChannel.ID, ipcWrapper);
	}
}

export class ConfigGetThemeChannel extends Channel<void, "dark" | "light"> {
	public static readonly ID: string = "config.theme.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ConfigGetThemeChannel.ID, ipcWrapper);
	}
}

export class ConfigSetThemeChannel extends Channel<"dark" | "light", void> {
	public static readonly ID: string = "config.theme.set";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ConfigSetThemeChannel.ID, ipcWrapper);
		this.setShouldVoidResult(true);
	}
}


export class CollectionsGetAllChannel extends Channel<boolean, Collection[]> {
	public static readonly ID: string = "collection.all.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + CollectionsGetAllChannel.ID, ipcWrapper, null);
	}
}

export class CollectionCreateChannel extends Channel<{
	name: string,
	type: CollectionType,
	parentGroupId: number | null,
	smartQuery: string | null
}, Collection> {
	public static readonly ID: string = "collection.create";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + CollectionCreateChannel.ID, ipcWrapper, null);
	}
}

export class CollectionDeleteChannel extends Channel<number, void> {
	public static readonly ID: string = "collection.delete";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + CollectionDeleteChannel.ID, ipcWrapper, null);
		this.setShouldVoidResult(true);
	}
}

export class CollectionEditChannel extends Channel<{
	collectionId: number,
	newName: string,
	newSmartQuery: string
}, void> {
	public static readonly ID: string = "collection.edit";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + CollectionEditChannel.ID, ipcWrapper, null);
		this.setShouldVoidResult(true);
	}
}

export class CollectionMoveChannel extends Channel<{
	collectionId: number,
	targetGroupId: number | null
}, void> {
	public static readonly ID: string = "collection.move";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + CollectionMoveChannel.ID, ipcWrapper, null);
		this.setShouldVoidResult(true);
	}
}

export class CollectionMoveItemsChannel extends Channel<{
	sourceCollectionId: number,
	targetCollectionId: number,
	itemIds: number[],
	copy: boolean
}, void> {
	public static readonly ID: string = "collection.items.move";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + CollectionMoveItemsChannel, ipcWrapper, null);
		this.setShouldVoidResult(true);
	}
}

export class CollectionRemoveItemsChannel extends Channel<{
	collectionId: number,
	itemIds: number[]
}, void> {
	public static readonly ID: string = "collection.items.remove";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + CollectionRemoveItemsChannel.ID, ipcWrapper, null);
		this.setShouldVoidResult(true);
	}
}


export class GroupsGetTreeChannel extends Channel<{
	includeCollections: boolean,
	includeItemCount: boolean
}, Group> {
	public static readonly ID: string = "group.tree.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + GroupsGetTreeChannel.ID, ipcWrapper, null);
	}
}

export class GroupCreateChannel extends Channel<{
	name: string,
	parentGroupId: number | null
}, Group> {
	public static readonly ID: string = "group.create";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + GroupCreateChannel.ID, ipcWrapper, null);
	}
}

export class GroupDeleteChannel extends Channel<{
	groupId: number,
	deleteChildren: boolean
}, void> {
	public static readonly ID: string = "group.delete";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + GroupDeleteChannel.ID, ipcWrapper, null);
		this.setShouldVoidResult(true);
	}
}

export class GroupRenameChannel extends Channel<{
	groupId: number,
	newName: string
}, void> {
	public static readonly ID: string = "group.rename";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + GroupRenameChannel.ID, ipcWrapper, null);
		this.setShouldVoidResult(true);
	}
}

export class GroupMoveChannel extends Channel<{
	groupId: number,
	targetGroupId: number | null
}, void> {
	public static readonly ID: string = "group.move";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + GroupMoveChannel.ID, ipcWrapper, null);
		this.setShouldVoidResult(true);
	}
}


export class ItemsGetByCollectionChannel extends Channel<{
	collectionId: number,
	itemAttributeKeys: string[]
}, ItemData[]> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".item.by-collection.get", ipcWrapper, false);
	}
}

export class ItemGetByIdChannel extends Channel<number, ItemData | null> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".item.by-id.get", ipcWrapper, false);
	}
}

export class ItemsDeleteChannel extends Channel<number[], void> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".item.delete", ipcWrapper, null);
		this.setShouldVoidResult(true);
	}
}

export class ItemsImportChannel extends Channel<ImportProcessData, ImportResult> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".item.import", ipcWrapper, null);
	}
}

export class ItemsImportStatusChannel extends Channel<ImportStatus, void> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".item.import.status", ipcWrapper, null);
	}
}

export class ItemGetMetadataChannel extends Channel<number, MetadataEntry[]> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".item.metadata.get", ipcWrapper, null);
	}
}

export class ItemSetMetadataChannel extends Channel<{
	itemId: number,
	entryKey: string,
	newValue: string
}, MetadataEntry> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".item.metadata.set", ipcWrapper, null);
	}
}

export class ItemsOpenExternalChannel extends Channel<number[], void> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".item.open-external", ipcWrapper, null);
	}
}


export class LibrariesGetLastOpenedChannel extends Channel<void, LastOpenedLibraryEntry[]> {
	public static readonly ID: string = "library.last-opened.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + LibrariesGetLastOpenedChannel.ID, ipcWrapper, null);
	}
}

export class LibraryCreateChannel extends Channel<{
	targetDir: string,
	name: string
}, void> {
	public static readonly ID: string = "library.create";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + LibraryCreateChannel.ID, ipcWrapper, null);
	}
}

export class LibraryOpenChannel extends Channel<string, void> {
	public static readonly ID: string = "library.open";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + LibraryOpenChannel.ID, ipcWrapper, null);
	}
}

export class LibraryCloseChannel extends Channel<void, void> {
	public static readonly ID: string = "library.close";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + LibraryCloseChannel.ID, ipcWrapper, null);
	}
}

export class LibraryGetMetadataChannel extends Channel<void, LibraryMetadata> {
	public static readonly ID: string = "library.metadata.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + LibraryGetMetadataChannel.ID, ipcWrapper, null);
	}
}
