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
import {ActionGetLibraryInfo} from "./service/library/ActionGetLibraryInfo";
import {ActionOpenLibrary} from "./service/library/actionOpenLibrary";
import {ImportService} from "./service/import/importService";
import {ImportDataValidator} from "./service/import/importDataValidator";
import {ImportStepFileHash} from "./service/import/importStepFileHash";
import {ImportStepThumbnail} from "./service/import/importStepThumbnail";
import {ImportStepRename} from "./service/import/importStepRename";
import {ImportStepImportTarget} from "./service/import/importStepImportTarget";
import {ImportStepMetadata} from "./service/import/importStepMetadata";
import {voidThen} from "../common/utils";
import {EventDistributor} from "../common/events/eventDistributor";
import {EventIds} from "../common/events/eventIds";
import {DataRepository} from "./service/dataRepository";

export class ActionHandler {

	private readonly eventHandler = new EventDistributor();
	private readonly broadcaster: (eventId: string, payload: any) => Promise<any>;

	constructor(
		dataRepository: DataRepository,
		broadcaster: (eventId: string, payload: any) => Promise<any>
	) {
		this.broadcaster = broadcaster;

		const configAccess: ConfigAccess = new ConfigAccess();
		const fsWrapper: FileSystemWrapper = new FileSystemWrapper();

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

		const actionDeleteItems = new ActionDeleteItems(dataRepository);
		const actionGetItemById = new ActionGetItemById(dataRepository);
		const actionGetItemAttributes = new ActionGetItemAttributes(dataRepository, actionGetItemById);
		const actionGetItemsByCollection = new ActionGetItemsByCollection(dataRepository, actionGetCollectionById);
		const actionOpenItemsExternal = new ActionOpenItemsExternal(dataRepository, fsWrapper);
		const actionUpdateItemAttribute = new ActionUpdateItemAttribute(dataRepository);

		const actionAddToLastOpened = new ActionAddToLastOpened(configAccess);
		const actionGetExiftoolInfo = new ActionGetExiftoolInfo(configAccess);
		const actionGetLastOpened = new ActionGetLastOpened(configAccess);
		const actionGetTheme = new ActionGetTheme(configAccess);
		const actionOpenConfig = new ActionOpenConfig(configAccess, fsWrapper);
		const actionSetTheme = new ActionSetTheme(configAccess);

		const actionCloseLibrary = new ActionCloseLibrary(dataRepository);
		const actionCreateLibrary = new ActionCreateLibrary(dataRepository, fsWrapper);
		const actionGetLibraryInfo = new ActionGetLibraryInfo(dataRepository);
		const actionOpenLibrary = new ActionOpenLibrary(dataRepository, fsWrapper, actionGetLibraryInfo);

		const importService: ImportService = new ImportService(
			dataRepository,
			new ImportDataValidator(fsWrapper),
			new ImportStepFileHash(fsWrapper),
			new ImportStepThumbnail(),
			new ImportStepRename(),
			new ImportStepImportTarget(fsWrapper),
			new ImportStepMetadata(actionGetExiftoolInfo),
			(status: any) => this.send(EventIds.IMPORT_STATUS, status)
		);

		this.eventHandler.on(EventIds.OPEN_CONFIG, () => actionOpenConfig.perform())
		this.eventHandler.on(EventIds.GET_EXIFTOOL_INFO, () => actionGetExiftoolInfo.perform())
		this.eventHandler.on(EventIds.GET_THEME, () => actionGetTheme.perform())
		this.eventHandler.on(EventIds.SET_THEME, (theme: "dark" | "light") => actionSetTheme.perform(theme))

		this.eventHandler.on(EventIds.GET_LAST_OPENED_LIBS, () => actionGetLastOpened.perform())
		this.eventHandler.on(EventIds.CREATE_LIBRARY, (payload) => {
			return actionCreateLibrary.perform(payload.name, payload.targetDir, true)
				.then((library) => actionAddToLastOpened.perform(library.path, library.name));
		})
		this.eventHandler.on(EventIds.OPEN_LIBRARY, (payload) => {
			return actionOpenLibrary.perform(payload)
				.then((library) => actionAddToLastOpened.perform(library.path, library.name));
		})
		this.eventHandler.on(EventIds.CLOSE_LIBRARY, () => actionCloseLibrary.perform())
		this.eventHandler.on(EventIds.GET_LIBRARY_INFO, () => actionGetLibraryInfo.perform())

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

		this.eventHandler.on(EventIds.GET_ITEMS_BY_COLLECTION, (payload) => actionGetItemsByCollection.perform(payload.collectionId, payload.itemAttributeKeys, payload.includeMissingAttributes));
		this.eventHandler.on(EventIds.GET_ITEM_BY_ID, (payload) => actionGetItemById.perform(payload));
		this.eventHandler.on(EventIds.DELETE_ITEMS, (payload) => actionDeleteItems.perform(payload));
		this.eventHandler.on(EventIds.OPEN_ITEMS, (payload) => actionOpenItemsExternal.perform(payload));
		this.eventHandler.on(EventIds.GET_ITEM_ATTRIBUTES, (payload) => actionGetItemAttributes.perform(payload));
		this.eventHandler.on(EventIds.SET_ITEM_ATTRIBUTE, (payload) => actionUpdateItemAttribute.perform(payload.itemId, payload.entryKey, payload.newValue));
		this.eventHandler.on(EventIds.IMPORT_ITEMS, (payload) => importService.import(payload));

	}


	public triggerAction(eventId: string, payload?: any): any {
		return this.eventHandler.handle(eventId, payload);
	}


	private send(eventId: string, payload: any): Promise<void> {
		return this.broadcaster(eventId, payload).then(voidThen)
	}

}
