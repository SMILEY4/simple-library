import {ConfigService} from "./service/configService";
import {ConfigAccess} from "./persistence/configAccess";
import {
	ConfigGetExiftoolChannel,
	ConfigGetThemeChannel,
	ConfigOpenChannel,
	ConfigSetThemeChannel,
	LibrariesGetLastOpenedChannel, LibraryCloseChannel,
	LibraryCreateChannel, LibraryGetMetadataChannel, LibraryOpenChannel
} from "../common/messaging/channels/channels";
import {workerIpcWrapper} from "../common/messaging/core/ipcWrapper";
import {LibraryService} from "./service/libraryService";
import {DbAccess} from "./persistence/dbAcces";

export function initBackgroundWorker(): void {
	console.log("initialize background worker");

	const configAccess: ConfigAccess = new ConfigAccess();
	const dbAccess: DbAccess = new DbAccess();

	const configService: ConfigService = new ConfigService(configAccess);
	const libraryService: LibraryService = new LibraryService(dbAccess);


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
			return libraryService.createLibrary(payload.name, payload.targetDir)
				.then((library) => configService.addLastOpened(library.path, library.name))
		});

	new LibraryOpenChannel(workerIpcWrapper(), "w")
		.on((payload) => {
			return libraryService.openLibrary(payload)
				.then((library) => configService.addLastOpened(library.path, library.name))
		});

	new LibraryCloseChannel(workerIpcWrapper(), "w")
		.on(() => libraryService.closeLibrary());

	new LibraryGetMetadataChannel(workerIpcWrapper(), "w")
		.on(() => libraryService.getLibraryInformation());
}