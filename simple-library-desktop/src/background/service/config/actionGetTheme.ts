import {ConfigAccess} from "../../persistence/configAccess";
import {AppTheme, CFG_THEME} from "./configCommons";

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