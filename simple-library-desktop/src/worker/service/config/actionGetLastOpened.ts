import {ConfigAccess} from "../../persistence/configAccess";
import {CFG_LAST_OPENED, LastOpenedEntry} from "./configCommons";

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