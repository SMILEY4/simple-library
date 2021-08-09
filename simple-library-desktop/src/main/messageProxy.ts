import {mainIpcWrapper} from "../common/messaging/core/ipcWrapper";
import {
	CollectionCreateChannel,
	CollectionDeleteChannel,
	CollectionEditChannel,
	CollectionMoveChannel, CollectionMoveItemsChannel,
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
	LibraryOpenChannel,
	proxyChannel
} from "../common/messaging/channels/channels";
import {BrowserWindow} from "electron";
import {WindowHandle} from "./windowHandle";

export class MessageProxy {

	constructor(workerWindowProvider: () => BrowserWindow, rendererWindowProvider: () => BrowserWindow) {
		const ipcWrapperToWorker = mainIpcWrapper(workerWindowProvider);
		const ipcWrapperToRenderer = mainIpcWrapper(rendererWindowProvider);

		proxyChannel(ipcWrapperToWorker, ConfigOpenChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, ConfigGetExiftoolChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, ConfigGetThemeChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, LibrariesGetLastOpenedChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, LibraryGetMetadataChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, LibraryCreateChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, LibraryOpenChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, LibraryCloseChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, GroupsGetTreeChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, GroupCreateChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, GroupDeleteChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, GroupRenameChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, GroupMoveChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, CollectionsGetAllChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, CollectionCreateChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, CollectionDeleteChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, CollectionEditChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, CollectionMoveChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, CollectionRemoveItemsChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, ItemsGetByCollectionChannel.ID, false);
		proxyChannel(ipcWrapperToWorker, ItemGetByIdChannel.ID, false);
		proxyChannel(ipcWrapperToWorker, ItemsDeleteChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, CollectionMoveItemsChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, ItemsOpenExternalChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, ItemGetMetadataChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, ItemSetMetadataChannel.ID, true);
		proxyChannel(ipcWrapperToWorker, ItemsImportChannel.ID, true);
		proxyChannel(ipcWrapperToRenderer, ItemsImportStatusChannel.ID, true, "w", "r");

		const channelSetTheme = new ConfigSetThemeChannel(ipcWrapperToWorker, "w");
		new ConfigSetThemeChannel(ipcWrapperToWorker, "r").on((theme) => {
			return channelSetTheme.send(theme).then(() => WindowHandle.setTheme(theme));
		});

	}

}
