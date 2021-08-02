import {ConfigAccess} from "../../persistence/configAccess";
import {ConfigCommons} from "./configCommons";
import AppTheme = ConfigCommons.AppTheme;
import CFG_THEME = ConfigCommons.CFG_THEME;

/**
 * Set the application theme.
 */
export class ActionSetTheme {

	private readonly configAccess: ConfigAccess;

	constructor(configAccess: ConfigAccess) {
		this.configAccess = configAccess;
	}


	public perform(theme: AppTheme): void {
		this.configAccess.setValue(CFG_THEME, theme);

	}

}