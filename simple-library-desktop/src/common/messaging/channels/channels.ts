import {IpcWrapper} from "../../events/core/ipcWrapper";
import {Channel} from "../core/channel";
import {
	AttributeDTO,
	CollectionDTO,
	CollectionTypeDTO,
	ExiftoolInfoDTO,
	GroupDTO, ImportProcessDataDTO,
	ImportResultDTO,
	ImportStatusDTO,
	ItemDTO,
	LastOpenedLibraryDTO,
	LibraryInfoDTO,
	ThemeDTO
} from "../../events/dtoModels";

export type ComDir = "r" | "w";

export function proxyChannel(ipcWrapper: IpcWrapper, id: string, logPayload: boolean, dirFrom?: ComDir, dirTo?: ComDir): void {
	const channelFrom = new Channel((dirFrom ? dirFrom : "r") + "." + id, ipcWrapper, logPayload);
	const channelTo = new Channel((dirTo ? dirTo : "w") + "." + id, ipcWrapper, logPayload);
	channelFrom.on((payload: any, traceId: string) => {
		return channelTo.send(payload, traceId + "-p").then((response) => response);
	});
}

export class ConfigOpenChannel extends Channel<void, void> {
	public static readonly ID: string = "config.open";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ConfigOpenChannel.ID, ipcWrapper, true);
		this.setShouldVoidResult(true);
	}
}

export class ConfigGetExiftoolChannel extends Channel<void, ExiftoolInfoDTO> {
	public static readonly ID: string = "config.exiftool.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ConfigGetExiftoolChannel.ID, ipcWrapper, true);
	}
}

export class ConfigGetThemeChannel extends Channel<void, ThemeDTO> {
	public static readonly ID: string = "config.theme.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ConfigGetThemeChannel.ID, ipcWrapper, true);
	}
}

export class ConfigSetThemeChannel extends Channel<ThemeDTO, void> {
	public static readonly ID: string = "config.theme.set";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ConfigSetThemeChannel.ID, ipcWrapper, true);
		this.setShouldVoidResult(true);
	}
}


export class CollectionsGetAllChannel extends Channel<boolean, CollectionDTO[]> {
	public static readonly ID: string = "collection.all.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + CollectionsGetAllChannel.ID, ipcWrapper, true);
	}
}

export class CollectionCreateChannel extends Channel<{
	name: string,
	type: CollectionTypeDTO,
	parentGroupId: number | null,
	smartQuery: string | null
}, CollectionDTO> {
	public static readonly ID: string = "collection.create";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + CollectionCreateChannel.ID, ipcWrapper, true);
	}
}

export class CollectionDeleteChannel extends Channel<number, void> {
	public static readonly ID: string = "collection.delete";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + CollectionDeleteChannel.ID, ipcWrapper, true);
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
		super(comDir + "." + CollectionEditChannel.ID, ipcWrapper, true);
		this.setShouldVoidResult(true);
	}
}

export class CollectionMoveChannel extends Channel<{
	collectionId: number,
	targetGroupId: number | null
}, void> {
	public static readonly ID: string = "collection.move";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + CollectionMoveChannel.ID, ipcWrapper, true);
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
		super(comDir + "." + CollectionMoveItemsChannel.ID, ipcWrapper, true);
		this.setShouldVoidResult(true);
	}
}

export class CollectionRemoveItemsChannel extends Channel<{
	collectionId: number,
	itemIds: number[]
}, void> {
	public static readonly ID: string = "collection.items.remove";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + CollectionRemoveItemsChannel.ID, ipcWrapper, true);
		this.setShouldVoidResult(true);
	}
}


export class GroupsGetTreeChannel extends Channel<{
	includeCollections: boolean,
	includeItemCount: boolean
}, GroupDTO> {
	public static readonly ID: string = "group.tree.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + GroupsGetTreeChannel.ID, ipcWrapper, true);
	}
}

export class GroupCreateChannel extends Channel<{
	name: string,
	parentGroupId: number | null
}, GroupDTO> {
	public static readonly ID: string = "group.create";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + GroupCreateChannel.ID, ipcWrapper, true);
	}
}

export class GroupDeleteChannel extends Channel<{
	groupId: number,
	deleteChildren: boolean
}, void> {
	public static readonly ID: string = "group.delete";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + GroupDeleteChannel.ID, ipcWrapper, true);
		this.setShouldVoidResult(true);
	}
}

export class GroupRenameChannel extends Channel<{
	groupId: number,
	newName: string
}, void> {
	public static readonly ID: string = "group.rename";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + GroupRenameChannel.ID, ipcWrapper, true);
		this.setShouldVoidResult(true);
	}
}

export class GroupMoveChannel extends Channel<{
	groupId: number,
	targetGroupId: number | null
}, void> {
	public static readonly ID: string = "group.move";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + GroupMoveChannel.ID, ipcWrapper, true);
		this.setShouldVoidResult(true);
	}
}


export class ItemsGetByCollectionChannel extends Channel<{
	collectionId: number,
	itemAttributeKeys: string[]
}, ItemDTO[]> {
	public static readonly ID: string = "item.by-collection.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ItemsGetByCollectionChannel.ID, ipcWrapper, false);
	}
}

export class ItemGetByIdChannel extends Channel<number, ItemDTO | null> {
	public static readonly ID: string = "item.by-id.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ItemGetByIdChannel.ID, ipcWrapper, false);
	}
}

export class ItemsDeleteChannel extends Channel<number[], void> {
	public static readonly ID: string = "item.delete";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ItemsDeleteChannel.ID, ipcWrapper, true);
		this.setShouldVoidResult(true);
	}
}

export class ItemsImportChannel extends Channel<ImportProcessDataDTO, ImportResultDTO> {
	public static readonly ID: string = "item.import";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ItemsImportChannel.ID, ipcWrapper, true);
	}
}

export class ItemsImportStatusChannel extends Channel<ImportStatusDTO, void> {
	public static readonly ID: string = "item.import.status";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ItemsImportStatusChannel.ID, ipcWrapper, true);
	}
}

export class ItemGetMetadataChannel extends Channel<number, AttributeDTO[]> {
	public static readonly ID: string = "item.metadata.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ItemGetMetadataChannel.ID, ipcWrapper, true);
	}
}

export class ItemSetMetadataChannel extends Channel<{
	itemId: number,
	entryKey: string,
	newValue: string
}, AttributeDTO> {
	public static readonly ID: string = "item.metadata.set";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ItemSetMetadataChannel.ID, ipcWrapper, true);
	}
}

export class ItemsOpenExternalChannel extends Channel<number[], void> {
	public static readonly ID: string = "item.open-external";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + ItemsOpenExternalChannel.ID, ipcWrapper, true);
	}
}


export class LibrariesGetLastOpenedChannel extends Channel<void, LastOpenedLibraryDTO[]> {
	public static readonly ID: string = "library.last-opened.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + LibrariesGetLastOpenedChannel.ID, ipcWrapper, true);
	}
}

export class LibraryCreateChannel extends Channel<{
	targetDir: string,
	name: string
}, void> {
	public static readonly ID: string = "library.create";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + LibraryCreateChannel.ID, ipcWrapper, true);
	}
}

export class LibraryOpenChannel extends Channel<string, void> {
	public static readonly ID: string = "library.open";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + LibraryOpenChannel.ID, ipcWrapper, true);
	}
}

export class LibraryCloseChannel extends Channel<void, void> {
	public static readonly ID: string = "library.close";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + LibraryCloseChannel.ID, ipcWrapper, true);
	}
}

export class LibraryGetMetadataChannel extends Channel<void, LibraryInfoDTO> {
	public static readonly ID: string = "library.metadata.get";

	constructor(ipcWrapper: IpcWrapper, comDir: ComDir) {
		super(comDir + "." + LibraryGetMetadataChannel.ID, ipcWrapper, true);
	}
}
