import {ConfigService} from "./service/configService";
import {ConfigAccess} from "./persistence/configAccess";
import {
    CollectionCreateChannel,
    CollectionDeleteChannel,
    CollectionEditChannel,
    CollectionMoveChannel, CollectionMoveItemsChannel, CollectionRemoveItemsChannel,
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
import {CollectionService} from "./service/collectionService";

export function initBackgroundWorker(): void {
    console.log("initialize background worker");

    const configAccess: ConfigAccess = new ConfigAccess();
    const dbAccess: DbAccess = new DbAccess();

    const configService: ConfigService = new ConfigService(configAccess);
    const libraryService: LibraryService = new LibraryService(dbAccess);
    const collectionService: CollectionService = new CollectionService(dbAccess)
    const groupService: GroupService = new GroupService(dbAccess, collectionService);

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
            return libraryService.create(payload.name, payload.targetDir)
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
        .on((payload) => collectionService.getAll(payload));

    new CollectionCreateChannel(workerIpcWrapper(), "w")
        .on((payload) => collectionService.create(payload.name, payload.type, payload.parentGroupId, payload.smartQuery));

    new CollectionDeleteChannel(workerIpcWrapper(), "w")
        .on((payload) => collectionService.delete(payload));

    new CollectionEditChannel(workerIpcWrapper(), "w")
        .on((payload) => collectionService.edit(payload.collectionId, payload.newName, payload.newSmartQuery));

    new CollectionMoveChannel(workerIpcWrapper(), "w")
        .on((payload) => collectionService.move(payload.collectionId, payload.targetGroupId));

    new CollectionMoveItemsChannel(workerIpcWrapper(), "w")
        .on((payload) => collectionService.moveItems(payload.sourceCollectionId, payload.targetCollectionId, payload.itemIds, payload.copy))

    new CollectionRemoveItemsChannel(workerIpcWrapper(), "w")
        .on((payload) => collectionService.removeItems(payload.collectionId, payload.itemIds))


}
