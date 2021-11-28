import {ConfigAccess} from "./persistence/configAccess";
import {FileSystemWrapper} from "./service/fileSystemWrapper";
import {ActionGetAllCollections} from "./service/collection/actionGetAllCollections";
import {ActionGetCollectionById} from "./service/collection/actionGetCollectionById";
import {ActionCreateCollection} from "./service/collection/actionCreateCollection";
import {ActionDeleteCollection} from "./service/collection/actionDeleteCollection";
import {ActionEditCollection} from "./service/collection/actionEditCollection";
import {ActionMoveCollection} from "./service/collection/actionMoveCollection";
import {ActionMoveAllCollections} from "./service/collection/actionMoveAllCollections";
import {ActionMoveItems} from "./service/collection/actionMoveItems";
import {ActionRemoveItems} from "./service/collection/actionRemoveItems";
import {ActionGetAllGroups} from "./service/group/actionGetAllGroups";
import {ActionGetGroupById} from "./service/group/actionGetGroupById";
import {ActionCreateGroup} from "./service/group/actionCreateGroup";
import {ActionMoveAllGroups} from "./service/group/actionMoveAllGroups";
import {ActionMoveGroup} from "./service/group/actionMoveGroup";
import {ActionDeleteGroup} from "./service/group/actionDeleteGroup";
import {ActionGetGroupTree} from "./service/group/actionGetGroupTree";
import {ActionRenameGroup} from "./service/group/actionRenameGroup";
import {ActionDeleteItems} from "./service/item/actionDeleteItems";
import {ActionGetItemById} from "./service/item/actionGetItemById";
import {ActionGetItemAttributes} from "./service/item/actionGetItemAttributes";
import {ActionGetItemsByCollection} from "./service/item/actionGetItemsByCollection";
import {ActionOpenItemsExternal} from "./service/item/actionOpenItemsExternal";
import {ActionUpdateItemAttribute} from "./service/item/actionUpdateItemAttribute";
import {ActionAddToLastOpened} from "./service/config/actionAddToLastOpened";
import {ActionGetExiftoolInfo} from "./service/config/actionGetExiftoolInfo";
import {ActionGetLastOpened} from "./service/config/actionGetLastOpened";
import {ActionGetTheme} from "./service/config/actionGetTheme";
import {ActionOpenConfig} from "./service/config/actionOpenConfig";
import {ActionSetTheme} from "./service/config/actionSetTheme";
import {ActionCloseLibrary} from "./service/library/actionCloseLibrary";
import {ActionCreateLibrary} from "./service/library/actionCreateLibrary";
import {ActionGetLibraryInfo} from "./service/library/actionGetLibraryInfo";
import {ActionOpenLibrary} from "./service/library/actionOpenLibrary";
import {ImportService} from "./service/import/importService";
import {ImportDataValidator} from "./service/import/importDataValidator";
import {ImportStepFileHash} from "./service/import/importStepFileHash";
import {ImportStepThumbnail} from "./service/import/importStepThumbnail";
import {ImportStepTargetFilepath} from "./service/import/importStepTargetFilepath";
import {ImportStepImportTarget} from "./service/import/importStepImportTarget";
import {ImportStepMetadata} from "./service/import/importStepMetadata";
import {voidThen} from "../common/utils";
import {EventDistributor} from "../common/events/eventDistributor";
import {EventIds} from "../common/events/eventIds";
import {DataRepository} from "./service/dataRepository";
import {ActionDeleteItemAttribute} from "./service/item/actionDeleteItemAttribute";
import {AttributeMetadataProvider} from "./persistence/attributeMetadata";
import {ActionEmbedItemAttributes} from "./service/item/actionEmbedItemAttributes";
import {EmbedStatusDTO} from "../common/events/dtoModels";
import {ActionReadItemAttributesFromFile} from "./service/item/actionReadItemAttributesFromFile";
import {ActionReloadItemAttributes} from "./service/item/actionReloadItemAttributes";
import {ActionSetItemAttributes} from "./service/item/actionSetItemAttributes";
import {ActionGetAppConfig} from "./service/config/actionGetAppConfig";
import {ActionSetAppConfig} from "./service/config/actionSetAppConfig";
import {ActionGetLibraryAttributeMeta} from "./service/library/actionGetLibraryAttributeMeta";
import {ActionSetHiddenAttributes} from "./service/library/actionSetHiddenAttributes";
import {ActionGetHiddenAttributes} from "./service/library/actionGetHiddenAttributes";
import {ActionGetLibraryAttributeMetaByKeys} from "./service/library/actionGetLibraryAttributeMetaByKeys";
import {ImportDbWriter} from "./service/import/importDbWriter";
import {ActionGetDefaultAttributeValues} from "./service/library/actionGetDefaultAttributeValues";
import {ActionSetDefaultAttributeValues} from "./service/library/actionSetDefaultAttributeValues";
import {ImportStepWriteDefaultValues} from "./service/import/importStepWriteDefaultValues";

export class ActionHandler {

	private readonly eventHandler = new EventDistributor();
	private readonly broadcaster: (eventId: string, payload: any) => Promise<any>;

	constructor(
		dataRepository: DataRepository,
		broadcaster: (eventId: string, payload: any) => Promise<any>,
		isDev: boolean,
		isRemoteWorker: boolean
	) {
		this.broadcaster = broadcaster;

		const configAccess: ConfigAccess = new ConfigAccess();
		const fsWrapper: FileSystemWrapper = new FileSystemWrapper();

		const actionAddToLastOpened = new ActionAddToLastOpened(configAccess);
		const actionGetExiftoolInfo = new ActionGetExiftoolInfo(configAccess);
		const actionGetLastOpened = new ActionGetLastOpened(configAccess);
		const actionGetTheme = new ActionGetTheme(configAccess);
		const actionOpenConfig = new ActionOpenConfig(configAccess, fsWrapper);
		const actionSetTheme = new ActionSetTheme(configAccess);
		const actionGetAppConfig = new ActionGetAppConfig(actionGetExiftoolInfo, actionGetTheme);
		const actionSetAppConfig = new ActionSetAppConfig(configAccess, actionSetTheme);

		const actionGetAllCollections = new ActionGetAllCollections(dataRepository);
		const actionGetCollectionById = new ActionGetCollectionById(dataRepository);
		const actionCreateCollection = new ActionCreateCollection(dataRepository);
		const actionDeleteCollection = new ActionDeleteCollection(dataRepository);
		const actionEditCollection = new ActionEditCollection(dataRepository, actionGetCollectionById);
		const actionMoveCollection = new ActionMoveCollection(dataRepository);
		const actionMoveAllCollections = new ActionMoveAllCollections(dataRepository);
		const actionMoveItems = new ActionMoveItems(dataRepository, actionGetCollectionById);
		const actionRemoveItems = new ActionRemoveItems(dataRepository, actionGetCollectionById);

		const actionGetAllGroups = new ActionGetAllGroups(dataRepository, actionGetAllCollections);
		const actionGetGroupById = new ActionGetGroupById(dataRepository);
		const actionCreateGroup = new ActionCreateGroup(dataRepository);
		const actionMoveAllGroups = new ActionMoveAllGroups(dataRepository);
		const actionMoveGroup = new ActionMoveGroup(dataRepository, actionGetGroupById);
		const actionDeleteGroup = new ActionDeleteGroup(dataRepository, actionGetGroupById, actionMoveAllCollections, actionMoveAllGroups);
		const actionGetGroupTree = new ActionGetGroupTree(actionGetAllGroups);
		const actionRenameGroup = new ActionRenameGroup(dataRepository, actionGetGroupById);

		const actionSetHiddenAttributes = new ActionSetHiddenAttributes(dataRepository);
		const actionGetHiddenAttributes = new ActionGetHiddenAttributes(dataRepository);
		const actionGetDefaultAttributeValues = new ActionGetDefaultAttributeValues(dataRepository);
		const actionSetDefaultAttributeValues = new ActionSetDefaultAttributeValues(dataRepository);

		const actionGetLibraryAttributeMetaAll = new ActionGetLibraryAttributeMeta(dataRepository);
		const actionGetLibraryAttributeMetaByKeys = new ActionGetLibraryAttributeMetaByKeys(dataRepository);

		const actionReadFileAttributes = new ActionReadItemAttributesFromFile(actionGetExiftoolInfo);
		const actionDeleteItems = new ActionDeleteItems(dataRepository);
		const actionGetItemById = new ActionGetItemById(dataRepository);
		const actionGetItemAttributes = new ActionGetItemAttributes(dataRepository, actionGetItemById);
		const actionGetItemsByCollection = new ActionGetItemsByCollection(dataRepository, actionGetCollectionById, actionGetHiddenAttributes);
		const actionOpenItemsExternal = new ActionOpenItemsExternal(dataRepository, fsWrapper);
		const actionUpdateItemAttribute = new ActionUpdateItemAttribute(dataRepository);
		const actionDeleteItemAttribute = new ActionDeleteItemAttribute(dataRepository);
		const actionEmbedItemAttributes = new ActionEmbedItemAttributes(
			actionGetExiftoolInfo,
			actionReadFileAttributes,
			new ActionReloadItemAttributes(
				actionGetItemById,
				actionGetExiftoolInfo,
				actionReadFileAttributes,
				actionGetLibraryAttributeMetaByKeys,
				new ActionSetItemAttributes(dataRepository)
			),
			fsWrapper,
			dataRepository,
			(status: EmbedStatusDTO) => this.send(EventIds.EMBED_ITEM_ATTRIBUTES_STATUS, status)
		);

		const actionCloseLibrary = new ActionCloseLibrary(dataRepository);
		const actionCreateLibrary = new ActionCreateLibrary(
			dataRepository,
			fsWrapper,
			new AttributeMetadataProvider(isDev || isDev === undefined || isDev === null, isRemoteWorker === true)
		);
		const actionGetLibraryInfo = new ActionGetLibraryInfo(dataRepository);
		const actionOpenLibrary = new ActionOpenLibrary(dataRepository, fsWrapper, actionGetLibraryInfo);

		const importService: ImportService = new ImportService(
			dataRepository,
			new ImportDataValidator(fsWrapper),
			new ImportStepFileHash(fsWrapper),
			new ImportStepThumbnail(),
			new ImportStepWriteDefaultValues(actionGetDefaultAttributeValues, actionGetExiftoolInfo),
			new ImportStepTargetFilepath(),
			new ImportStepImportTarget(fsWrapper),
			new ImportStepMetadata(new ActionReadItemAttributesFromFile(actionGetExiftoolInfo)),
			new ImportDbWriter(dataRepository, actionGetLibraryAttributeMetaByKeys),
			(status: any) => this.send(EventIds.IMPORT_STATUS, status)
		);

		this.eventHandler.on(EventIds.GET_APP_CONFIG, () => actionGetAppConfig.perform());
		this.eventHandler.on(EventIds.SET_APP_CONFIG, (config) => actionSetAppConfig.perform(config));

		this.eventHandler.on(EventIds.OPEN_CONFIG, () => actionOpenConfig.perform());
		this.eventHandler.on(EventIds.GET_EXIFTOOL_INFO, () => actionGetExiftoolInfo.perform());
		this.eventHandler.on(EventIds.GET_THEME, () => actionGetTheme.perform());
		this.eventHandler.on(EventIds.SET_THEME, (theme: "dark" | "light") => actionSetTheme.perform(theme));

		this.eventHandler.on(EventIds.GET_LAST_OPENED_LIBS, () => actionGetLastOpened.perform());
		this.eventHandler.on(EventIds.CREATE_LIBRARY, (payload) => {
			return actionCreateLibrary.perform(payload.name, payload.targetDir, true)
				.then((library) => actionAddToLastOpened.perform(library.path, library.name));
		});
		this.eventHandler.on(EventIds.OPEN_LIBRARY, (payload) => {
			return actionOpenLibrary.perform(payload)
				.then((library) => actionAddToLastOpened.perform(library.path, library.name));
		});
		this.eventHandler.on(EventIds.CLOSE_LIBRARY, () => actionCloseLibrary.perform());
		this.eventHandler.on(EventIds.GET_LIBRARY_INFO, () => actionGetLibraryInfo.perform());
		this.eventHandler.on(EventIds.GET_LIBRARY_ATTRIBUTE_META_ALL_FILTER_NAME, (filter) => actionGetLibraryAttributeMetaAll.perform(filter));
		this.eventHandler.on(EventIds.GET_LIBRARY_ATTRIBUTE_META_BY_KEYS, (keys) => actionGetLibraryAttributeMetaByKeys.perform(keys));
		this.eventHandler.on(EventIds.SET_HIDDEN_ATTRIBUTES, (payload) => actionSetHiddenAttributes.perform(payload.attributeIds, payload.mode));
		this.eventHandler.on(EventIds.GET_HIDDEN_ATTRIBUTES, () => actionGetHiddenAttributes.perform());
		this.eventHandler.on(EventIds.SET_DEFAULT_ATTRIBUTE_VALUES, (entries) => actionSetDefaultAttributeValues.perform(entries));
		this.eventHandler.on(EventIds.GET_DEFAULT_ATTRIBUTE_VALUES, () => actionGetDefaultAttributeValues.perform());

		this.eventHandler.on(EventIds.GET_GROUP_TREE, (payload) => actionGetGroupTree.perform(payload.includeCollections, payload.includeItemCount));
		this.eventHandler.on(EventIds.CREATE_GROUP, (payload) => actionCreateGroup.perform(payload.name, payload.parentGroupId));
		this.eventHandler.on(EventIds.DELETE_GROUP, (payload) => actionDeleteGroup.perform(payload.groupId, payload.deleteChildren));
		this.eventHandler.on(EventIds.RENAME_GROUP, (payload) => actionRenameGroup.perform(payload.groupId, payload.newName));
		this.eventHandler.on(EventIds.MOVE_GROUP, (payload) => actionMoveGroup.perform(payload.groupId, payload.targetGroupId));

		this.eventHandler.on(EventIds.GET_ALL_COLLECTIONS, (payload) => actionGetAllCollections.perform(payload));
		this.eventHandler.on(EventIds.CREATE_COLLECTION, (payload) => actionCreateCollection.perform(payload.type, payload.name, payload.parentGroupId, payload.smartQuery));
		this.eventHandler.on(EventIds.DELETE_COLLECTION, (payload) => actionDeleteCollection.perform(payload));
		this.eventHandler.on(EventIds.EDIT_COLLECTION, (payload) => actionEditCollection.perform(payload.collectionId, payload.newName, payload.newSmartQuery));
		this.eventHandler.on(EventIds.MOVE_COLLECTION, (payload) => actionMoveCollection.perform(payload.collectionId, payload.targetGroupId));
		this.eventHandler.on(EventIds.MOVE_ITEMS, (payload) => actionMoveItems.perform(payload.sourceCollectionId, payload.targetCollectionId, payload.itemIds, payload.copy));
		this.eventHandler.on(EventIds.REMOVE_ITEMS, (payload) => actionRemoveItems.perform(payload.collectionId, payload.itemIds));

		this.eventHandler.on(EventIds.GET_ITEMS_BY_COLLECTION, (payload) => actionGetItemsByCollection.perform(payload.collectionId, payload.itemAttributeIds, payload.includeMissingAttributes, payload.includeHiddenAttribs));
		this.eventHandler.on(EventIds.GET_ITEM_BY_ID, (payload) => actionGetItemById.perform(payload));
		this.eventHandler.on(EventIds.DELETE_ITEMS, (payload) => actionDeleteItems.perform(payload));
		this.eventHandler.on(EventIds.OPEN_ITEMS, (payload) => actionOpenItemsExternal.perform(payload));
		this.eventHandler.on(EventIds.GET_ITEM_ATTRIBUTES, (payload) => actionGetItemAttributes.perform(payload.itemId, payload.includeHidden));
		this.eventHandler.on(EventIds.SET_ITEM_ATTRIBUTE, (payload) => actionUpdateItemAttribute.perform(payload.itemId, payload.attributeId, payload.newValue));
		this.eventHandler.on(EventIds.DELETE_ITEM_ATTRIBUTE, (payload) => actionDeleteItemAttribute.perform(payload.itemId, payload.attributeId));
		this.eventHandler.on(EventIds.IMPORT_ITEMS, (payload) => importService.import(payload));
		this.eventHandler.on(EventIds.EMBED_ITEM_ATTRIBUTES, (payload) => actionEmbedItemAttributes.perform(payload.itemIds, payload.allAttributes));
	}


	public triggerAction(eventId: string, payload?: any): any {
		return this.eventHandler.handle(eventId, payload);
	}


	private send(eventId: string, payload: any): Promise<void> {
		return this.broadcaster(eventId, payload).then(voidThen);
	}

}
