import {EventSender} from "./core/eventSender";
import {IpcWrapper} from "./core/ipcWrapper";
import {
    AttributeDTO,
    CollectionDTO,
    CollectionTypeDTO,
    ExiftoolInfoDTO,
    GroupDTO,
    ImportProcessDataDTO,
    ImportResultDTO,
    ImportStatusDTO,
    ItemDTO,
    LastOpenedLibraryDTO,
    LibraryInfoDTO,
    ThemeDTO
} from "./dtoModels";

export module EventIds {

    export const OPEN_CONFIG = "config.open";
    export const GET_EXIFTOOL_INFO = "config.exiftool.get";
    export const GET_THEME = "config.theme.get";
    export const SET_THEME = "config.theme.set";

    export const GET_ALL_COLLECTIONS = "collection.all.get";
    export const CREATE_COLLECTION = "collection.create";
    export const DELETE_COLLECTION = "collection.delete";
    export const EDIT_COLLECTION = "collection.edit";
    export const MOVE_COLLECTION = "collection.move";
    export const IMPORT_STATUS = "item.import.status";
    export const MOVE_ITEMS = "collection.items.move";
    export const REMOVE_ITEMS = "collection.items.remove";
    export const GET_GROUP_TREE = "group.tree.get";
    export const CREATE_GROUP = "group.create";
    export const DELETE_GROUP = "group.delete";
    export const RENAME_GROUP = "group.rename";
    export const MOVE_GROUP = "group.move";
    export const GET_ITEMS_BY_COLLECTION = "item.by-collection.get";
    export const GET_ITEM_BY_ID = "item.by-id.get";
    export const DELETE_ITEMS = "item.delete";
    export const IMPORT_ITEMS = "item.import";
    export const GET_ITEM_ATTRIBUTES = "item.metadata.get";
    export const SET_ITEM_ATTRIBUTE = "item.metadata.set";
    export const OPEN_ITEMS = "item.open-external";
    export const GET_LAST_OPENED_LIBS = "library.last-opened.get";
    export const CREATE_LIBRARY = "library.create";
    export const OPEN_LIBRARY = "library.open";
    export const CLOSE_LIBRARY = "library.close";
    export const GET_LIBRARY_INFO = "library.metadata.get";



}

export class ConfigOpenEventSender extends EventSender<void, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.OPEN_CONFIG, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class ConfigGetExiftoolEventSender extends EventSender<void, ExiftoolInfoDTO> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.GET_EXIFTOOL_INFO, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class ConfigGetThemeEventSender extends EventSender<void, ThemeDTO> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.GET_THEME, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class ConfigSetThemeEventSender extends EventSender<ThemeDTO, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.SET_THEME, ipcWrapper, {idPrefix: idPrefix});
    }
}


export class CollectionsGetAllEventSender extends EventSender<boolean, CollectionDTO[]> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.GET_ALL_COLLECTIONS, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class CollectionCreateEventSender extends EventSender<{
    name: string,
    type: CollectionTypeDTO,
    parentGroupId: number | null,
    smartQuery: string | null
}, CollectionDTO> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.CREATE_COLLECTION, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class CollectionDeleteEventSender extends EventSender<number, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.DELETE_COLLECTION, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class CollectionEditEventSender extends EventSender<{
    collectionId: number,
    newName: string,
    newSmartQuery: string
}, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.EDIT_COLLECTION, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class CollectionMoveEventSender extends EventSender<{
    collectionId: number,
    targetGroupId: number | null
}, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.MOVE_COLLECTION, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class CollectionMoveItemsEventSender extends EventSender<{
    sourceCollectionId: number,
    targetCollectionId: number,
    itemIds: number[],
    copy: boolean
}, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.MOVE_ITEMS, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class CollectionRemoveItemsEventSender extends EventSender<{
    collectionId: number,
    itemIds: number[]
}, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.REMOVE_ITEMS, ipcWrapper, {idPrefix: idPrefix});
    }
}


export class GroupsGetTreeEventSender extends EventSender<{
    includeCollections: boolean,
    includeItemCount: boolean
}, GroupDTO> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.GET_GROUP_TREE, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class GroupCreateEventSender extends EventSender<{
    name: string,
    parentGroupId: number | null
}, GroupDTO> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.CREATE_GROUP, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class GroupDeleteEventSender extends EventSender<{
    groupId: number,
    deleteChildren: boolean
}, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.DELETE_GROUP, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class GroupRenameEventSender extends EventSender<{
    groupId: number,
    newName: string
}, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.RENAME_GROUP, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class GroupMoveEventSender extends EventSender<{
    groupId: number,
    targetGroupId: number | null
}, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.MOVE_GROUP, ipcWrapper, {idPrefix: idPrefix});
    }
}


export class ItemsGetByCollectionEventSender extends EventSender<{
    collectionId: number,
    itemAttributeKeys: string[]
}, ItemDTO[]> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.GET_ITEMS_BY_COLLECTION, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class ItemGetByIdEventSender extends EventSender<number, ItemDTO | null> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.GET_ITEM_BY_ID, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class ItemsDeleteEventSender extends EventSender<number[], void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.DELETE_ITEMS, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class ItemsImportEventSender extends EventSender<ImportProcessDataDTO, ImportResultDTO> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.IMPORT_ITEMS, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class ItemsImportStatusEventSender extends EventSender<ImportStatusDTO, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.IMPORT_STATUS, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class ItemGetAttributesEventSender extends EventSender<number, AttributeDTO[]> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.GET_ITEM_ATTRIBUTES, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class ItemSetAttributeEventSender extends EventSender<{
    itemId: number,
    entryKey: string,
    newValue: string
}, AttributeDTO> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.SET_ITEM_ATTRIBUTE, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class ItemsOpenExternalEventSender extends EventSender<number[], void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.OPEN_ITEMS, ipcWrapper, {idPrefix: idPrefix});
    }
}


export class LibrariesGetLastOpenedEventSender extends EventSender<void, LastOpenedLibraryDTO[]> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.GET_LAST_OPENED_LIBS, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class LibraryCreateEventSender extends EventSender<{
    targetDir: string,
    name: string
}, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.CREATE_LIBRARY, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class LibraryOpenEventSender extends EventSender<string, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.OPEN_LIBRARY, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class LibraryCloseEventSender extends EventSender<void, void> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.CLOSE_LIBRARY, ipcWrapper, {idPrefix: idPrefix});
    }
}

export class LibraryGetInfoEventSender extends EventSender<void, LibraryInfoDTO> {
    constructor(ipcWrapper: IpcWrapper, idPrefix: string) {
        super(EventIds.GET_LIBRARY_INFO, ipcWrapper, {idPrefix: idPrefix});
    }
}
