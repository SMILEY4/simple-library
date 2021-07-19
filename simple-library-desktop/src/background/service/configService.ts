import {ConfigAccess, ConfigKey} from "../persistence/configAccess";

const shell = require("electron").shell;

export type AppTheme = "light" | "dark"

export interface ExiftoolInfo {
	location: string | null;
	defined: boolean;
}

export class ConfigService {

	private readonly configAccess: ConfigAccess;

	constructor(configAccess: ConfigAccess) {
		this.configAccess = configAccess;
	}

	/**
	 * Opens the config file with the system default application
	 */
	public openConfig(): void {
		return shell.openPath(this.configAccess.getConfigFileLocation()).then();
	}

	/**
	 * Get information about the configured exiftool executable
	 */
	public getExiftoolInfo(): ExiftoolInfo {
		const location = this.configAccess.getValueOr<string>(ConfigKey.EXIFTOOL_LOCATION, "");
		if (location.length > 0) {
			return {
				location: location,
				defined: true
			};
		} else {
			return {
				location: null,
				defined: false
			};
		}
	}

	/**
	 * Get the application theme
	 */
	public getTheme(): AppTheme {
		return this.configAccess.getValueOr<AppTheme>(ConfigKey.THEME, "dark");
	}

	/**
	 * Set the application theme
	 */
	public setTheme(theme: AppTheme): void {
		this.configAccess.setValue(ConfigKey.THEME, theme);
	}

}