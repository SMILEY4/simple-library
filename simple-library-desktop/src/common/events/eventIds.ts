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
	export const EMBED_ITEM_ATTRIBUTES_STATUS = "item.attributes.embed.status";
	export const OPEN_ITEMS = "item.open-external";
	export const SHOW_ITEM_IN_FOLDER= "item.show-in-folder";
	export const GET_LAST_OPENED_LIBS = "library.last-opened.get";
	export const CREATE_LIBRARY = "library.create";
	export const OPEN_LIBRARY = "library.open";
	export const CLOSE_LIBRARY = "library.close";
	export const GET_LIBRARY_INFO = "library.metadata.get";
	export const GET_LIBRARY_ATTRIBUTE_META_ALL_FILTER_NAME = "library.attribute_meta.all";
	export const GET_LIBRARY_ATTRIBUTE_META_BY_KEYS = "library.attribute_meta.by-keys";
	export const SET_HIDDEN_ATTRIBUTES = "library.hidden_attributes.set";
	export const GET_HIDDEN_ATTRIBUTES = "library.hidden_attributes.get";
	export const SET_DEFAULT_ATTRIBUTE_VALUES = "library.default_attribute_values.set";
	export const GET_DEFAULT_ATTRIBUTE_VALUES = "library.default_attribute_values.get";
	export const GET_ITEM_LIST_ATTRIBUTES = "library.item-list-attributes.get";
	export const SET_ITEM_LIST_ATTRIBUTES = "library.item-list-attributes.set";


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
		SHOW_ITEM_IN_FOLDER,
		GET_LAST_OPENED_LIBS,
		CREATE_LIBRARY,
		OPEN_LIBRARY,
		CLOSE_LIBRARY,
		GET_LIBRARY_INFO,
		EMBED_ITEM_ATTRIBUTES,
		EMBED_ITEM_ATTRIBUTES_STATUS,
		GET_LIBRARY_ATTRIBUTE_META_ALL_FILTER_NAME,
		GET_LIBRARY_ATTRIBUTE_META_BY_KEYS,
		SET_HIDDEN_ATTRIBUTES,
		GET_HIDDEN_ATTRIBUTES,
		SET_DEFAULT_ATTRIBUTE_VALUES,
		GET_DEFAULT_ATTRIBUTE_VALUES,
		GET_ITEM_LIST_ATTRIBUTES,
		SET_ITEM_LIST_ATTRIBUTES
	];

}
