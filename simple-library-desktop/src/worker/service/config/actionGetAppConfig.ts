import {ApplicationConfig} from "./configCommons";
import {ActionGetExiftoolInfo} from "./actionGetExiftoolInfo";
import {ActionGetTheme} from "./actionGetTheme";

/**
 * Fetches the complete global application config
 */
export class ActionGetAppConfig {

	private readonly actionGetExiftoolInfo: ActionGetExiftoolInfo;
	private readonly actionGetTheme: ActionGetTheme;

	constructor(actionGetExiftoolInfo: ActionGetExiftoolInfo, actionGetTheme: ActionGetTheme) {
		this.actionGetExiftoolInfo = actionGetExiftoolInfo;
		this.actionGetTheme = actionGetTheme;
	}

	public perform(): ApplicationConfig {
		const exiftoolInfo = this.actionGetExiftoolInfo.perform();
		return {
			exiftoolPath: exiftoolInfo.defined ? exiftoolInfo.location : null,
			theme: this.actionGetTheme.perform()
		};
	}

}