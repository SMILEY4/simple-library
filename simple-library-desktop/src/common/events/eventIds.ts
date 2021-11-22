
export module EventIds {

    export const GET_APP_CONFIG = "config.get";
    export const SET_APP_CONFIG = "config.set";
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
    export const DELETE_ITEM_ATTRIBUTE = "item.metadata.delete";
    export const EMBED_ITEM_ATTRIBUTES = "item.attributes.embed";
    export const EMBED_ITEM_ATTRIBUTES_STATUS = "item.attributes.embed.status"
    export const OPEN_ITEMS = "item.open-external";
    export const GET_LAST_OPENED_LIBS = "library.last-opened.get";
    export const CREATE_LIBRARY = "library.create";
    export const OPEN_LIBRARY = "library.open";
    export const CLOSE_LIBRARY = "library.close";
    export const GET_LIBRARY_INFO = "library.metadata.get";

    export const ALL_IDS = [
        GET_APP_CONFIG,
        SET_APP_CONFIG,
        OPEN_CONFIG,
        GET_EXIFTOOL_INFO,
        GET_THEME,
        SET_THEME,
        GET_ALL_COLLECTIONS,
        CREATE_COLLECTION,
        DELETE_COLLECTION,
        EDIT_COLLECTION,
        MOVE_COLLECTION,
        IMPORT_STATUS,
        MOVE_ITEMS,
        REMOVE_ITEMS,
        GET_GROUP_TREE,
        CREATE_GROUP,
        DELETE_GROUP,
        RENAME_GROUP,
        MOVE_GROUP,
        GET_ITEMS_BY_COLLECTION,
        GET_ITEM_BY_ID,
        DELETE_ITEMS,
        IMPORT_ITEMS,
        GET_ITEM_ATTRIBUTES,
        SET_ITEM_ATTRIBUTE,
        DELETE_ITEM_ATTRIBUTE,
        OPEN_ITEMS,
        GET_LAST_OPENED_LIBS,
        CREATE_LIBRARY,
        OPEN_LIBRARY,
        CLOSE_LIBRARY,
        GET_LIBRARY_INFO,
        EMBED_ITEM_ATTRIBUTES,
        EMBED_ITEM_ATTRIBUTES_STATUS
    ]

}
