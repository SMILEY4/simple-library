import {
    ApplicationConfigDTO,
    AttributeDTO, AttributeKeyDTO,
    AttributeMetaDTO,
    CollectionTypeDTO, DefaultAttributeValueEntryDTO,
    EmbedReportDTO,
    EmbedStatusDTO,
    ExiftoolInfoDTO,
    GroupDTO,
    ImportProcessDataDTO,
    ImportResultDTO,
    ImportStatusDTO,
    ItemDTO,
    LastOpenedLibraryDTO
} from "../../../common/events/dtoModels";
import {EventBroadcaster} from "../../../common/events/core/eventBroadcaster";
import {EventConsumer} from "../../../common/events/core/eventConsumer";
import {EventIds} from "../../../common/events/eventIds";

const eventBroadcaster = new EventBroadcaster({
    comPartner: {
        partner: "main"
    },
    eventIdPrefix: "r",
    suppressPayloadLog: [EventIds.GET_ITEMS_BY_COLLECTION, EventIds.GET_ITEM_BY_ID]
});

const eventConsumer = new EventConsumer({
    eventIds: [EventIds.IMPORT_STATUS, EventIds.EMBED_ITEM_ATTRIBUTES_STATUS],
    comPartner: {
        partner: "main"
    },
    eventIdPrefix: "r",
    suppressPayloadLog: [EventIds.GET_ITEMS_BY_COLLECTION, EventIds.GET_ITEM_BY_ID]
});

export function addImportStatusListener(listener: (status: ImportStatusDTO) => void): void {
    eventConsumer.on<ImportStatusDTO, void>(EventIds.IMPORT_STATUS, listener);
}

export function removeImportStatusListener(): void {
    eventConsumer.clear(EventIds.IMPORT_STATUS);
}

export function fetchLastOpenedLibraries(): Promise<LastOpenedLibraryDTO[]> {
    return eventBroadcaster.send(EventIds.GET_LAST_OPENED_LIBS);
}

export function requestOpenLibrary(filepath: string): Promise<void> {
    return eventBroadcaster.send(EventIds.OPEN_LIBRARY, filepath);
}

export function requestCreateLibrary(name: string, targetDir: string): Promise<void> {
    return eventBroadcaster.send(EventIds.CREATE_LIBRARY, {targetDir: targetDir, name: name});
}

export function fetchRootGroup(): Promise<GroupDTO> {
    return eventBroadcaster.send(EventIds.GET_GROUP_TREE, {includeItemCount: true, includeCollections: true});
}

export function fetchItems(
    collectionId: number,
    itemAttributeIds: number[],
    includeMissingAttribs: boolean,
    includeHiddenAttribs: boolean
): Promise<ItemDTO[]> {
    return eventBroadcaster.send(EventIds.GET_ITEMS_BY_COLLECTION, {
        collectionId: collectionId,
        itemAttributeIds: itemAttributeIds,
        includeMissingAttributes: includeMissingAttribs,
        includeHiddenAttribs: includeHiddenAttribs
    });
}

export function fetchItemById(itemId: number): Promise<ItemDTO | null> {
    return eventBroadcaster.send(EventIds.GET_ITEM_BY_ID, itemId);
}

export function requestMoveItems(srcCollectionId: number, tgtCollectionId: number, itemIds: number[], copy: boolean): Promise<void> {
    return eventBroadcaster.send(EventIds.MOVE_ITEMS, {
        sourceCollectionId: srcCollectionId,
        targetCollectionId: tgtCollectionId,
        itemIds: itemIds,
        copy: copy
    });
}


export function requestRemoveItems(collectionId: number, itemIds: number[]): Promise<void> {
    return eventBroadcaster.send(EventIds.REMOVE_ITEMS, {collectionId: collectionId, itemIds: itemIds});
}


export function requestDeleteItems(itemIds: number[]): Promise<void> {
    return eventBroadcaster.send(EventIds.DELETE_ITEMS, itemIds);
}


export function fetchItemMetadata(itemId: number, includeHidden: boolean): Promise<AttributeDTO[]> {
    return eventBroadcaster.send(EventIds.GET_ITEM_ATTRIBUTES, {
        itemId: itemId,
        includeHidden: includeHidden
    });
}

export function setItemMetadata(itemId: number, attributeId: number, value: string): Promise<AttributeDTO> {
    return eventBroadcaster.send(EventIds.SET_ITEM_ATTRIBUTE, {
        itemId: itemId,
        attributeId: attributeId,
        newValue: value
    });
}

export function deleteItemMetadata(itemId: number, attributeId: number): Promise<AttributeDTO | null> {
    return eventBroadcaster.send(EventIds.DELETE_ITEM_ATTRIBUTE, {itemId: itemId, attributeId: attributeId});
}

export function requestImport(
    data: ImportProcessDataDTO,
    callbackSuccess: (result: ImportResultDTO) => void,
    callbackFailed: (result: ImportResultDTO) => void,
    callbackWithErrors: (result: ImportResultDTO) => void
): Promise<ImportResultDTO> {
    return eventBroadcaster.send(EventIds.IMPORT_ITEMS, data)
        .then((result: ImportResultDTO) => {
            if (result.failed) {
                callbackFailed(result);
            } else if (result.encounteredErrors) {
                callbackWithErrors(result);
            } else {
                callbackSuccess(result);
            }
            return result;
        });
}

export function requestCloseLibrary(): Promise<void> {
    return eventBroadcaster.send(EventIds.CLOSE_LIBRARY);
}

export function requestCreateCollection(name: string, type: CollectionTypeDTO, query: string | null, parentGroupId: number | null): Promise<void> {
    return eventBroadcaster.send(EventIds.CREATE_COLLECTION, {
        name: name,
        type: type,
        parentGroupId: parentGroupId,
        smartQuery: type === "smart" ? query : null
    }).then();
}

export function requestEditCollection(collectionId: number, name: string, query: string | null): Promise<void> {
    return eventBroadcaster.send(EventIds.EDIT_COLLECTION, {
        collectionId: collectionId,
        newName: name,
        newSmartQuery: query
    });
}

export function requestDeleteCollection(collectionId: number): Promise<void> {
    return eventBroadcaster.send(EventIds.DELETE_COLLECTION, collectionId);
}

export function requestCreateGroup(name: string, parentGroupId: number | null): Promise<void> {
    return eventBroadcaster.send(EventIds.CREATE_GROUP, {name: name, parentGroupId: parentGroupId}).then();
}

export function requestRenameGroup(groupId: number, name: string): Promise<void> {
    return eventBroadcaster.send(EventIds.RENAME_GROUP, {groupId: groupId, newName: name});
}

export function requestDeleteGroup(groupId: number, deleteChildren: boolean): Promise<void> {
    return eventBroadcaster.send(EventIds.DELETE_GROUP, {groupId: groupId, deleteChildren: deleteChildren});
}

export function requestMoveGroup(groupId: number, targetGroupId: number | null): Promise<void> {
    return eventBroadcaster.send(EventIds.MOVE_GROUP, {groupId: groupId, targetGroupId: targetGroupId});
}

export function requestMoveCollection(collectionId: number, targetGroupId: number | null): Promise<void> {
    return eventBroadcaster.send(EventIds.MOVE_COLLECTION, {collectionId: collectionId, targetGroupId: targetGroupId});
}

export function requestOpenItemsExternal(itemIds: number[]): Promise<void> {
    return eventBroadcaster.send(EventIds.OPEN_ITEMS, itemIds);
}

export function requestOpenConfigFile(): Promise<void> {
    return eventBroadcaster.send(EventIds.OPEN_CONFIG);
}

export function fetchApplicationConfig(): Promise<ApplicationConfigDTO> {
    return eventBroadcaster.send(EventIds.GET_APP_CONFIG);
}

export function requestUpdateApplicationConfig(config: ApplicationConfigDTO): Promise<any> {
    return eventBroadcaster.send(EventIds.SET_APP_CONFIG, config);
}

export function fetchExiftoolData(): Promise<[string | null, boolean]> {
    return eventBroadcaster.send(EventIds.GET_EXIFTOOL_INFO)
        .then((data: ExiftoolInfoDTO) => [data.location, data.defined]);
}

export function setTheme(theme: "dark" | "light"): Promise<void> {
    return eventBroadcaster.send(EventIds.SET_THEME, theme);
}

export function getTheme(): Promise<"dark" | "light"> {
    return eventBroadcaster.send(EventIds.GET_THEME);
}

export function requestEmbedAttributes(itemIds: number[] | null, allAttributes: boolean): Promise<EmbedReportDTO> {
    return eventBroadcaster.send(EventIds.EMBED_ITEM_ATTRIBUTES, {
        itemIds: itemIds,
        allAttributes: allAttributes
    });
}

export function addEmbedStatusListener(listener: (status: EmbedStatusDTO) => void): void {
    eventConsumer.on<EmbedStatusDTO, void>(EventIds.EMBED_ITEM_ATTRIBUTES_STATUS, listener);
}

export function removeEmbedStatusListener(): void {
    eventConsumer.clear(EventIds.EMBED_ITEM_ATTRIBUTES_STATUS);
}

export function fetchAllAttributeMetaFilterName(filter: string | null): Promise<AttributeMetaDTO[]> {
    return eventBroadcaster.send(EventIds.GET_LIBRARY_ATTRIBUTE_META_ALL_FILTER_NAME, filter);
}


export function fetchAllAttributeMetaByKeys(attributeKeys: AttributeKeyDTO[]): Promise<AttributeMetaDTO[]> {
    return eventBroadcaster.send(EventIds.GET_LIBRARY_ATTRIBUTE_META_BY_KEYS, attributeKeys);
}

export function fetchHiddenAttributes(): Promise<AttributeMetaDTO[]> {
    return eventBroadcaster.send(EventIds.GET_HIDDEN_ATTRIBUTES);
}

export function requestSetHiddenAttributes(attributeIds: number[], mode: "hide" | "show"): Promise<void> {
    return eventBroadcaster.send(EventIds.SET_HIDDEN_ATTRIBUTES, {
        attributeIds: attributeIds,
        mode: mode
    });
}

export function fetchDefaultAttributeValues(): Promise<DefaultAttributeValueEntryDTO[]> {
    return eventBroadcaster.send(EventIds.GET_DEFAULT_ATTRIBUTE_VALUES);
}

export function requestSetDefaultAttributeValues(entries: DefaultAttributeValueEntryDTO[]): Promise<void> {
    return eventBroadcaster.send(EventIds.SET_DEFAULT_ATTRIBUTE_VALUES, entries);
}