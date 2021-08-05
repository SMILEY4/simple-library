import {ConfigAccess} from "../../persistence/configAccess";
import {CFG_EXIFTOOL_LOCATION, ExiftoolInfo} from "./configCommons";

/**
 * Get information about the configured exiftool executable.
 */
export class ActionGetExiftoolInfo {

	private readonly configAccess: ConfigAccess;

	constructor(configAccess: ConfigAccess) {
		this.configAccess = configAccess;
	}


	public perform(): ExiftoolInfo {
		const location = this.getExiftoolLocation();
		return location.length > 0
			? this.exiftoolInfo(location)
			: this.missingInfo();
	}


	private getExiftoolLocation(): string {
		return this.configAccess.getValueOr<string>(CFG_EXIFTOOL_LOCATION, "");
	}


	private exiftoolInfo(location: string): ExiftoolInfo {
		return {
			location: location,
			defined: true
		};
	}


	private missingInfo(): ExiftoolInfo {
		return {
			location: null,
			defined: false
		};
	}

}