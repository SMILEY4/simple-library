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


}