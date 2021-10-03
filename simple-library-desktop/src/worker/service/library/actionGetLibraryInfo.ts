import {LibraryInformation} from "./libraryCommons";
import {DataRepository} from "../dataRepository";

/**
 * Get information / metadata about the current library
 */
export class ActionGetLibraryInfo {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}


	public perform(): Promise<LibraryInformation> {
		return this.queryInfo()
			.then((rows: any[]) => ({
				name: this.findName(rows),
				timestampCreated: this.findTimestampCreated(rows),
				timestampLastOpened: this.findTimestampLastOpened(rows)
			}));
	}


	private queryInfo(): Promise<any[]> {
		return this.repository.getLibraryInfo();
	}


	private findName(rows: any[]): string {
		return rows.find(row => row.key === "library_name").value;
	}


	private findTimestampCreated(rows: any[]): number {
		return parseInt(rows.find((row: any) => row.key === "timestamp_created").value);
	}


	private findTimestampLastOpened(rows: any[]): number {
		return parseInt(rows.find((row: any) => row.key === "timestamp_last_opened").value);
	}

}
