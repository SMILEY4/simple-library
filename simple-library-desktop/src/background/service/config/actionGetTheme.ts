import {ConfigAccess} from "../../persistence/configAccess";
import {ConfigCommons} from "./configCommons";
import AppTheme = ConfigCommons.AppTheme;
import CFG_THEME = ConfigCommons.CFG_THEME;

/**
 * Get the application theme.
 */
export class ActionGetTheme {

	private readonly configAccess: ConfigAccess;

	constructor(configAccess: ConfigAccess) {
		this.configAccess = configAccess;
	}

	public perform(): AppTheme {
		return this.configAccess.getValueOr<AppTheme>(CFG_THEME, "dark");
	}


}