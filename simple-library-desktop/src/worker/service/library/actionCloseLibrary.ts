import {DataRepository} from "../dataRepository";

/**
 * "Closes" the current library
 */
export class ActionCloseLibrary {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(): void {
		console.log("Closing library");
		this.repository.close();
	}

}
