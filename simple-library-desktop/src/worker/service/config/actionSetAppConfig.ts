import {ConfigAccess} from "../../persistence/configAccess";
import {ActionSetTheme} from "./actionSetTheme";
import {ApplicationConfig, CFG_EXIFTOOL_LOCATION} from "./configCommons";

/**
 * Sets the complete global application config
 */
export class ActionSetAppConfig {

	private readonly configAccess: ConfigAccess;
	private readonly actionSetTheme: ActionSetTheme;

	constructor(configAccess: ConfigAccess, actionSetTheme: ActionSetTheme) {
		this.configAccess = configAccess;
		this.actionSetTheme = actionSetTheme;
	}

	public perform(config: ApplicationConfig): void {
		this.actionSetTheme.perform(config.theme);
		this.configAccess.setValue(CFG_EXIFTOOL_LOCATION, (config.exiftoolPath.trim().length > 0) ? config.exiftoolPath.trim() : null);
	}

}