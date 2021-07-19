import {ConfigService} from "./service/configService";
import {ConfigAccess} from "./persistence/configAccess";
import {
	ConfigGetExiftoolChannel,
	ConfigGetThemeChannel,
	ConfigOpenChannel,
	ConfigSetThemeChannel
} from "../common/messaging/channels/channels";
import {rendererIpcWrapper} from "../common/messaging/core/msgUtils";

export function initBackgroundWorker(): void {
	console.log("initialize background worker");

	const configAccess: ConfigAccess = new ConfigAccess();

	const configService: ConfigService = new ConfigService(configAccess);


	new ConfigOpenChannel(rendererIpcWrapper())
		.on(() => configService.openConfig());

	new ConfigGetExiftoolChannel(rendererIpcWrapper())
		.on(() => configService.getExiftoolInfo());

	new ConfigGetThemeChannel(rendererIpcWrapper())
		.on(() => configService.getTheme());

	new ConfigSetThemeChannel(rendererIpcWrapper())
		.on((theme: "dark" | "light") => configService.setTheme(theme));

}