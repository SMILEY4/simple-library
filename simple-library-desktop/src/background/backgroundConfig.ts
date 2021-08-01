import {ConfigService} from "./service/configService";
import {ConfigAccess} from "./persistence/configAccess";
import {
    CollectionCreateChannel,
    CollectionDeleteChannel,
    CollectionEditChannel,
    CollectionMoveChannel,
    CollectionMoveItemsChannel,
    CollectionRemoveItemsChannel,
    CollectionsGetAllChannel,
    ConfigGetExiftoolChannel,
    ConfigGetThemeChannel,
    ConfigOpenChannel,
    ConfigSetThemeChannel,
    GroupCreateChannel,
    GroupDeleteChannel,
    GroupMoveChannel,
    GroupRenameChannel,
    GroupsGetTreeChannel,
    ItemGetByIdChannel,
    ItemGetMetadataChannel,
    ItemsDeleteChannel,
    ItemSetMetadataChannel,
    ItemsGetByCollectionChannel,
    ItemsImportChannel,
    ItemsImportStatusChannel,
    ItemsOpenExternalChannel,
    LibrariesGetLastOpenedChannel,
    LibraryCloseChannel,
    LibraryCreateChannel,
    LibraryGetMetadataChannel,
    LibraryOpenChannel
} from "../common/messaging/channels/channels";
import {workerIpcWrapper} from "../common/messaging/core/ipcWrapper";
import {LibraryService} from "./service/libraryService";
import {DbAccess} from "./persistence/dbAcces";
import {GroupService} from "./service/groupService";
import {ItemService} from "./service/itemService";
import {ImportService} from "./service/import/importService";
import {ImportDataValidator} from "./service/import/importDataValidator";
import {ImportStepFileHash} from "./service/import/importStepFileHash";
import {ImportStepThumbnail} from "./service/import/importStepThumbnail";
import {ImportStepRename} from "./service/import/importStepRename";
import {ImportStepImportTarget} from "./service/import/importStepImportTarget";
import {ImportStepMetadata} from "./service/import/importStepMetadata";
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

export function initBackgroundWorker(): void {
    console.log("initialize background worker");


    const configAccess: ConfigAccess = new ConfigAccess();
    const dbAccess: DbAccess = new DbAccess();
    const fsWrapper: FileSystemWrapper = new FileSystemWrapper();


    const actionGetAllCollections = new ActionGetAllCollections(dbAccess);
    const actionGetCollectionById = new ActionGetCollectionById(dbAccess);
    const actionCreateCollection = new ActionCreateCollection(dbAccess);
    const actionDeleteCollection = new ActionDeleteCollection(dbAccess);
    const actionEditCollection = new ActionEditCollection(dbAccess, actionGetCollectionById);
    const actionMoveCollection = new ActionMoveCollection(dbAccess);
    const actionMoveAllCollections = new ActionMoveAllCollections(dbAccess);
    const actionMoveItems = new ActionMoveItems(dbAccess, actionGetCollectionById);
    const actionRemoveItems = new ActionRemoveItems(dbAccess, actionGetCollectionById);

    const configService: ConfigService = new ConfigService(configAccess, fsWrapper);
    const libraryService: LibraryService = new LibraryService(dbAccess, fsWrapper);
    const groupService: GroupService = new GroupService(dbAccess, actionGetAllCollections, actionMoveAllCollections);
    const itemService: ItemService = new ItemService(dbAccess, actionGetCollectionById, fsWrapper);
    const importService: ImportService = new ImportService(
        dbAccess,
        new ImportDataValidator(fsWrapper),
        new ImportStepFileHash(fsWrapper),
        new ImportStepThumbnail(),
        new ImportStepRename(),
        new ImportStepImportTarget(fsWrapper),
        new ImportStepMetadata(configService),
        new ItemsImportStatusChannel(workerIpcWrapper(), "w")
    );

    new ConfigOpenChannel(workerIpcWrapper(), "w")
        .on(() => configService.openConfig());

    new ConfigGetExiftoolChannel(workerIpcWrapper(), "w")
        .on(() => configService.getExiftoolInfo());

    new ConfigGetThemeChannel(workerIpcWrapper(), "w")
        .on(() => configService.getTheme());

    new ConfigSetThemeChannel(workerIpcWrapper(), "w")
        .on((theme: "dark" | "light") => configService.setTheme(theme));

    new LibrariesGetLastOpenedChannel(workerIpcWrapper(), "w")
        .on(() => configService.getLastOpened());

    new LibraryCreateChannel(workerIpcWrapper(), "w")
        .on((payload) => {
            return libraryService.create(payload.name, payload.targetDir, true)
                .then((library) => configService.addLastOpened(library.path, library.name));
        });

    new LibraryOpenChannel(workerIpcWrapper(), "w")
        .on((payload) => {
            return libraryService.open(payload)
                .then((library) => configService.addLastOpened(library.path, library.name));
        });

    new LibraryCloseChannel(workerIpcWrapper(), "w")
        .on(() => libraryService.closeCurrent());

    new LibraryGetMetadataChannel(workerIpcWrapper(), "w")
        .on(() => libraryService.getCurrentInformation());

    new GroupsGetTreeChannel(workerIpcWrapper(), "w")
        .on((payload) => groupService.getTree(payload.includeCollections, payload.includeItemCount));

    new GroupCreateChannel(workerIpcWrapper(), "w")
        .on((payload) => groupService.create(payload.name, payload.parentGroupId));

    new GroupDeleteChannel(workerIpcWrapper(), "w")
        .on((payload) => groupService.delete(payload.groupId, payload.deleteChildren));

    new GroupRenameChannel(workerIpcWrapper(), "w")
        .on((payload) => groupService.rename(payload.groupId, payload.newName));

    new GroupMoveChannel(workerIpcWrapper(), "w")
        .on((payload) => groupService.move(payload.groupId, payload.targetGroupId));

    new CollectionsGetAllChannel(workerIpcWrapper(), "w")
        .on((payload) => actionGetAllCollections.perform(payload));

    new CollectionCreateChannel(workerIpcWrapper(), "w")
        .on((payload) => actionCreateCollection.perform(payload.type, payload.name, payload.parentGroupId, payload.smartQuery));

    new CollectionDeleteChannel(workerIpcWrapper(), "w")
        .on((payload) => actionDeleteCollection.perform(payload));

    new CollectionEditChannel(workerIpcWrapper(), "w")
        .on((payload) => actionEditCollection.perform(payload.collectionId, payload.newName, payload.newSmartQuery));

    new CollectionMoveChannel(workerIpcWrapper(), "w")
        .on((payload) => actionMoveCollection.perform(payload.collectionId, payload.targetGroupId));

    new CollectionMoveItemsChannel(workerIpcWrapper(), "w")
        .on((payload) => actionMoveItems.perform(payload.sourceCollectionId, payload.targetCollectionId, payload.itemIds, payload.copy));

    new CollectionRemoveItemsChannel(workerIpcWrapper(), "w")
        .on((payload) => actionRemoveItems.perform(payload.collectionId, payload.itemIds));

    new ItemsGetByCollectionChannel(workerIpcWrapper(), "w")
        .on((payload) => itemService.getByCollection(payload.collectionId, payload.itemAttributeKeys));

    new ItemGetByIdChannel(workerIpcWrapper(), "w")
        .on((payload) => itemService.getById(payload));

    new ItemsDeleteChannel(workerIpcWrapper(), "w")
        .on((payload) => itemService.delete(payload));

    new ItemsOpenExternalChannel(workerIpcWrapper(), "w")
        .on((payload) => itemService.openExternal(payload));

    new ItemGetMetadataChannel(workerIpcWrapper(), "w")
        .on((payload) => itemService.getAttributes(payload));

    new ItemSetMetadataChannel(workerIpcWrapper(), "w")
        .on((payload) => itemService.updateAttribute(payload.itemId, payload.entryKey, payload.newValue));

    new ItemsImportChannel(workerIpcWrapper(), "w")
        .on((payload) => importService.import(payload));

}
