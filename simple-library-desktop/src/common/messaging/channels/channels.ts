import {IpcWrapper} from "../core/msgUtils";
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

export interface GetExiftoolDataPayload {
	location: string | null;
	defined: boolean;
}

export class ConfigOpenChannel extends Channel<void, void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("config.open", ipcWrapper);
	}
}

export class ConfigGetExiftoolChannel extends Channel<void, GetExiftoolDataPayload> {
	constructor(ipcWrapper: IpcWrapper) {
		super("config.exiftool.get", ipcWrapper);
	}
}

export class ConfigGetThemeChannel extends Channel<void, "dark" | "light"> {
	constructor(ipcWrapper: IpcWrapper) {
		super("config.theme.get", ipcWrapper);
	}
}

export class ConfigSetThemeChannel extends Channel<"dark" | "light", void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("config.theme.set", ipcWrapper);
	}
}


export class CollectionsGetAllChannel extends Channel<boolean, Collection[]> {
	constructor(ipcWrapper: IpcWrapper) {
		super("collection.all.get", ipcWrapper);
	}
}

export class CollectionCreateChannel extends Channel<{
	name: string,
	type: CollectionType,
	parentGroupId: number | null,
	smartQuery: string | null
}, Collection> {
	constructor(ipcWrapper: IpcWrapper) {
		super("collection.create", ipcWrapper);
	}
}

export class CollectionDeleteChannel extends Channel<number, void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("collection.delete", ipcWrapper);
	}
}

export class CollectionEditChannel extends Channel<{
	collectionId: number,
	newName: string,
	newSmartQuery: string
}, void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("collection.edit", ipcWrapper);
	}
}

export class CollectionMoveChannel extends Channel<{
	collectionId: number,
	targetGroupId: number | null
}, void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("collection.move", ipcWrapper);
	}
}

export class CollectionMoveItemsChannel extends Channel<{
	sourceCollectionId: number,
	targetCollectionId: number,
	itemIds: number[],
	copy: boolean
}, void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("collection.items.move", ipcWrapper);
	}
}

export class CollectionRemoveItemsChannel extends Channel<{
	collectionId: number,
	itemIds: number[]
}, void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("collection.items.remove", ipcWrapper);
	}
}


export class GroupsGetAllChannel extends Channel<{
	includeCollections: boolean,
	includeItemCount: boolean
}, Group[]> {
	constructor(ipcWrapper: IpcWrapper) {
		super("group.all.get", ipcWrapper);
	}
}

export class GroupCreateChannel extends Channel<{
	name: string,
	parentGroupId: number | null
}, Group> {
	constructor(ipcWrapper: IpcWrapper) {
		super("group.create", ipcWrapper);
	}
}

export class GroupDeleteChannel extends Channel<{
	groupId: number,
	deleteChildren: boolean
}, void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("group.delete", ipcWrapper);
	}
}

export class GroupRenameChannel extends Channel<{
	groupId: number,
	newName: string
}, void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("group.rename", ipcWrapper);
	}
}

export class GroupMoveChannel extends Channel<{
	groupId: number,
	targetGroupId: number | null
}, void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("group.move", ipcWrapper);
	}
}


export class ItemsGetByCollectionChannel extends Channel<{
	collectionId: number,
	itemAttributeKeys: string[]
}, ItemData[]> {
	constructor(ipcWrapper: IpcWrapper) {
		super("item.by-collection.get", ipcWrapper, false);
	}
}

export class ItemGetByIdChannel extends Channel<number, ItemData | null> {
	constructor(ipcWrapper: IpcWrapper) {
		super("item.by-id.get", ipcWrapper, false);
	}
}

export class ItemsDeleteChannel extends Channel<number[], void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("item.delete", ipcWrapper);
	}
}

export class ItemsImportChannel extends Channel<ImportProcessData, ImportResult> {
	constructor(ipcWrapper: IpcWrapper) {
		super("item.import", ipcWrapper);
	}
}

export class ItemsImportStatusChannel extends Channel<ImportStatus, void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("item.import.status", ipcWrapper);
	}
}

export class ItemGetMetadataChannel extends Channel<number, MetadataEntry[]> {
	constructor(ipcWrapper: IpcWrapper) {
		super("item.metadata.get", ipcWrapper);
	}
}

export class ItemSetMetadataChannel extends Channel<{
	itemId: number,
	entryKey: string,
	newValue: string
}, MetadataEntry> {
	constructor(ipcWrapper: IpcWrapper) {
		super("item.metadata.set", ipcWrapper);
	}
}

export class ItemsOpenExternalChannel extends Channel<number[], void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("item.open-external", ipcWrapper);
	}
}


export class LibrariesGetLastOpenedChannel extends Channel<void, LastOpenedLibraryEntry[]> {
	constructor(ipcWrapper: IpcWrapper) {
		super("library.last-opened.get", ipcWrapper);
	}
}

export class LibraryCreateChannel extends Channel<{
	targetDir: string,
	name: string
}, void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("library.create", ipcWrapper);
	}
}

export class LibraryOpenChannel extends Channel<string, void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("library.open", ipcWrapper);
	}
}

export class LibraryCloseChannel extends Channel<void, void> {
	constructor(ipcWrapper: IpcWrapper) {
		super("library.close", ipcWrapper);
	}
}

export class LibraryGetMetadataChannel extends Channel<void, LibraryMetadata> {
	constructor(ipcWrapper: IpcWrapper) {
		super("library.metadata.get", ipcWrapper);
	}
}
