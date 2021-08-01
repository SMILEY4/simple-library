import {ConfigAccess, ConfigKey} from "../persistence/configAccess";
import {FileSystemWrapper} from "./fileSystemWrapper";
import {ConfigCommons} from "./config/configCommons";
import ExiftoolInfo = ConfigCommons.ExiftoolInfo;
import AppTheme = ConfigCommons.AppTheme;
import LastOpenedEntry = ConfigCommons.LastOpenedEntry;


export class ConfigService {

	private readonly configAccess: ConfigAccess;
	private readonly fsWrapper: FileSystemWrapper;

	constructor(configAccess: ConfigAccess, fsWrapper: FileSystemWrapper) {
		this.configAccess = configAccess;
		this.fsWrapper = fsWrapper;
	}

	/**
	 * Opens the config file with the system default application.
	 */
	public openConfig(): Promise<void> {
		return this.fsWrapper.open(this.configAccess.getConfigFileLocation()).then();
	}

	/**
	 * Get information about the configured exiftool executable.
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
	 * Get the application theme.
	 */
	public getTheme(): AppTheme {
		return this.configAccess.getValueOr<AppTheme>(ConfigKey.THEME, "dark");
	}

	/**
	 * Set the application theme.
	 */
	public setTheme(theme: AppTheme): void {
		this.configAccess.setValue(ConfigKey.THEME, theme);
	}

	/**
	 * Get the last used libraries.
	 */
	public getLastOpened(): LastOpenedEntry[] {
		return this.configAccess.getValueOr(ConfigKey.LAST_OPENED, []);
	}

	/**
	 * Add the given entry to the last-opened entries.
	 */
	public addLastOpened(path: string, name: string): void {
		const entry: LastOpenedEntry = {path: path, name: name};
		const prevEntries: LastOpenedEntry[] = this.configAccess
			.getValueOr<LastOpenedEntry[]>(ConfigKey.LAST_OPENED, [])
			.filter(entry => entry.path !== path)
			.slice(0, 2)
		this.configAccess.setValue(ConfigKey.LAST_OPENED, [entry, ...prevEntries])
	}

}