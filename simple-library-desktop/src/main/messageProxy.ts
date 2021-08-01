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

	constructor(workerWindowProvider: () => BrowserWindow) {
		const ipcWrapper = mainIpcWrapper(workerWindowProvider);

		proxyChannel(ipcWrapper, ConfigOpenChannel.ID, true);
		proxyChannel(ipcWrapper, ConfigGetExiftoolChannel.ID, true);
		proxyChannel(ipcWrapper, ConfigGetThemeChannel.ID, true);
		proxyChannel(ipcWrapper, LibrariesGetLastOpenedChannel.ID, true);
		proxyChannel(ipcWrapper, LibraryGetMetadataChannel.ID, true);
		proxyChannel(ipcWrapper, LibraryCreateChannel.ID, true);
		proxyChannel(ipcWrapper, LibraryOpenChannel.ID, true);
		proxyChannel(ipcWrapper, LibraryCloseChannel.ID, true);
		proxyChannel(ipcWrapper, GroupsGetTreeChannel.ID, true);
		proxyChannel(ipcWrapper, GroupCreateChannel.ID, true);
		proxyChannel(ipcWrapper, GroupDeleteChannel.ID, true);
		proxyChannel(ipcWrapper, GroupRenameChannel.ID, true);
		proxyChannel(ipcWrapper, GroupMoveChannel.ID, true);
		proxyChannel(ipcWrapper, CollectionsGetAllChannel.ID, true);
		proxyChannel(ipcWrapper, CollectionCreateChannel.ID, true);
		proxyChannel(ipcWrapper, CollectionDeleteChannel.ID, true);
		proxyChannel(ipcWrapper, CollectionEditChannel.ID, true);
		proxyChannel(ipcWrapper, CollectionMoveChannel.ID, true);
		proxyChannel(ipcWrapper, CollectionRemoveItemsChannel.ID, true);
		proxyChannel(ipcWrapper, ItemsGetByCollectionChannel.ID, false);
		proxyChannel(ipcWrapper, ItemGetByIdChannel.ID, false);
		proxyChannel(ipcWrapper, ItemsDeleteChannel.ID, true);
		proxyChannel(ipcWrapper, CollectionMoveItemsChannel.ID, true);
		proxyChannel(ipcWrapper, ItemsOpenExternalChannel.ID, true);
		proxyChannel(ipcWrapper, ItemGetMetadataChannel.ID, true);
		proxyChannel(ipcWrapper, ItemSetMetadataChannel.ID, true);
		proxyChannel(ipcWrapper, ItemsImportChannel.ID, true);
		proxyChannel(ipcWrapper, ItemsImportStatusChannel.ID, true, "w", "r");

		const channelSetTheme = new ConfigSetThemeChannel(ipcWrapper, "w");
		new ConfigSetThemeChannel(ipcWrapper, "r").on((theme) => {
			return channelSetTheme.send(theme).then(() => WindowHandle.setTheme(theme));
		});

	}

}
