import {ConfigDataAccess} from "../persistence/configDataAccess";

const open = require('open');

export class ApplicationService {

	configDataAccess: ConfigDataAccess;


	constructor(configDataAccess: ConfigDataAccess) {
		this.configDataAccess = configDataAccess;
	}

	public openConfigFile(): Promise<void> {
		return open(this.configDataAccess.getConfigFileLocation());
	}

	public getApplicationTheme(): "dark" | "light" {
		return this.configDataAccess.getApplicationTheme();
	}

	public setApplicationTheme(theme: "dark" | "light"): void {
		this.configDataAccess.setApplicationTheme(theme)
	}

}