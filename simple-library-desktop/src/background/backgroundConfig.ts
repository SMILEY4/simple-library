import {ConfigService} from "./service/configService";
import {ConfigAccess} from "./persistence/configAccess";
import {
	ConfigGetExiftoolChannel,
	ConfigGetThemeChannel,
	ConfigOpenChannel,
	ConfigSetThemeChannel
} from "../common/messaging/channels/channels";
import { workerIpcWrapper} from "../common/messaging/core/msgUtils";

export function initBackgroundWorker(): void {
	console.log("initialize background worker");

	const configAccess: ConfigAccess = new ConfigAccess();

	const configService: ConfigService = new ConfigService(configAccess);


	new ConfigOpenChannel(workerIpcWrapper(), "w")
		.on(() => configService.openConfig());

	new ConfigGetExiftoolChannel(workerIpcWrapper(), "w")
		.on(() => configService.getExiftoolInfo());

	new ConfigGetThemeChannel(workerIpcWrapper(), "w")
		.on(() => configService.getTheme());

	new ConfigSetThemeChannel(workerIpcWrapper(), "w")
		.on((theme: "dark" | "light") => configService.setTheme(theme));

}