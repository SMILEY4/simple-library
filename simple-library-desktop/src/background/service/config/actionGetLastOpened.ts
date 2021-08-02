import {ConfigAccess} from "../../persistence/configAccess";
import {ConfigCommons} from "./configCommons";
import AppTheme = ConfigCommons.AppTheme;
import CFG_THEME = ConfigCommons.CFG_THEME;
import CFG_LAST_OPENED = ConfigCommons.CFG_LAST_OPENED;
import LastOpenedEntry = ConfigCommons.LastOpenedEntry;

/**
 * Get the last used libraries.
 */
export class ActionGetLastOpened {

	private readonly configAccess: ConfigAccess;

	constructor(configAccess: ConfigAccess) {
		this.configAccess = configAccess;
	}

	public perform(): LastOpenedEntry[] {
		return this.configAccess.getValueOr(CFG_LAST_OPENED, []);
	}


}