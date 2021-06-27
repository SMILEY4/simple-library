import {ConfigDataAccess} from "../persistence/configDataAccess";

const shell = require('electron').shell;


export class ApplicationService {

	configDataAccess: ConfigDataAccess;


	constructor(configDataAccess: ConfigDataAccess) {
		this.configDataAccess = configDataAccess;
	}

	public openConfigFile(): Promise<void> {
		return shell.openPath(this.configDataAccess.getConfigFileLocation()).then();
	}

	public getApplicationTheme(): "dark" | "light" {
		return this.configDataAccess.getApplicationTheme();
	}

	public setApplicationTheme(theme: "dark" | "light"): void {
		this.configDataAccess.setApplicationTheme(theme)
	}

	public getExiftoolLocation(): string | null {
		return this.configDataAccess.getExiftoolLocation();
	}

}
