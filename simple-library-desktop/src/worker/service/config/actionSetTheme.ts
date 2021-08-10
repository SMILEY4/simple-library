import {ConfigAccess} from "../../persistence/configAccess";
import {AppTheme, CFG_THEME} from "./configCommons";

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