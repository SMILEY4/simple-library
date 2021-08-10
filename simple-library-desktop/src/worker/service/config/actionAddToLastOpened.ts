import {ConfigAccess} from "../../persistence/configAccess";
import {CFG_LAST_OPENED, LastOpenedEntry} from "./configCommons";

/**
 * Add the given entry to the last-opened entries.
 */
export class ActionAddToLastOpened {

	private readonly configAccess: ConfigAccess;

	constructor(configAccess: ConfigAccess) {
		this.configAccess = configAccess;
	}


	public perform(path: string, name: string): void {
		const entry = this.createEntry(path, name);
		const prevEntries = this.getPreparedPrevEntries(path);
		this.addAndSave(prevEntries, entry);
	}


	private createEntry(path: string, name: string): LastOpenedEntry {
		return {
			path: path,
			name: name
		};
	}


	private getPreparedPrevEntries(newPath: string): LastOpenedEntry[] {
		return this.configAccess.getValueOr<LastOpenedEntry[]>(CFG_LAST_OPENED, [])
			.filter(entry => entry.path !== newPath)
			.slice(0, 2);
	}


	private addAndSave(prevEntries: LastOpenedEntry[], newEntry: LastOpenedEntry) {
		this.configAccess.setValue(CFG_LAST_OPENED, [newEntry, ...prevEntries]);
	}

}