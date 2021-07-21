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
		return channelTo.send(payload, traceId+"-p").then((response) => response)
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
	}
}


export class CollectionsGetAllChannel extends Channel<boolean, Collection[]> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".collection.all.get", ipcWrapper, null);
	}
}

export class CollectionCreateChannel extends Channel<{
	name: string,
	type: CollectionType,
	parentGroupId: number | null,
	smartQuery: string | null
}, Collection> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".collection.create", ipcWrapper, null);
	}
}

export class CollectionDeleteChannel extends Channel<number, void> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".collection.delete", ipcWrapper, null);
	}
}

export class CollectionEditChannel extends Channel<{
	collectionId: number,
	newName: string,
	newSmartQuery: string
}, void> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".collection.edit", ipcWrapper, null);
	}
}

export class CollectionMoveChannel extends Channel<{
	collectionId: number,
	targetGroupId: number | null
}, void> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".collection.move", ipcWrapper, null);
	}
}

export class CollectionMoveItemsChannel extends Channel<{
	sourceCollectionId: number,
	targetCollectionId: number,
	itemIds: number[],
	copy: boolean
}, void> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".collection.items.move", ipcWrapper, null);
	}
}

export class CollectionRemoveItemsChannel extends Channel<{
	collectionId: number,
	itemIds: number[]
}, void> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".collection.items.remove", ipcWrapper, null);
	}
}


export class GroupsGetAllChannel extends Channel<{
	includeCollections: boolean,
	includeItemCount: boolean
}, Group[]> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".group.all.get", ipcWrapper, null);
	}
}

export class GroupCreateChannel extends Channel<{
	name: string,
	parentGroupId: number | null
}, Group> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".group.create", ipcWrapper, null);
	}
}

export class GroupDeleteChannel extends Channel<{
	groupId: number,
	deleteChildren: boolean
}, void> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".group.delete", ipcWrapper, null);
	}
}

export class GroupRenameChannel extends Channel<{
	groupId: number,
	newName: string
}, void> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".group.rename", ipcWrapper, null);
	}
}

export class GroupMoveChannel extends Channel<{
	groupId: number,
	targetGroupId: number | null
}, void> {
	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + ".group.move", ipcWrapper, null);
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
