import {ConfigAccess} from "../../persistence/configAccess";
import {FileSystemWrapper} from "../fileSystemWrapper";
import {voidThen} from "../../../common/utils";

/**
 * Opens the config file with the system default application.
 */
export class ActionOpenConfig {

	private readonly configAccess: ConfigAccess;
	private readonly fsWrapper: FileSystemWrapper;

	constructor(configAccess: ConfigAccess, fsWrapper: FileSystemWrapper) {
		this.configAccess = configAccess;
		this.fsWrapper = fsWrapper;
	}

	public perform(): Promise<void> {
		return this.fsWrapper.open(this.getLocation()).then(voidThen);
	}

	private getLocation(): string {
		return this.configAccess.getConfigFileLocation();
	}

}