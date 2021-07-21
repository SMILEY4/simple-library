import metadataGetAll from "./sqlfiles/library/metadata_get_all.sql";
import metadataUpdateTimestampLastOpened from "./sqlfiles/library/metadata_update_timestamp_last_opened.sql";
import libraryInitialize from "./sqlfiles/library/library_initialize.sql";


export module SQL {

	export function initializeNewLibrary(name: string, timestamp: number): string[] {
		return libraryInitialize
			.split(";")
			.filter((stmt: string) => /[a-zA-Z]/g.test(stmt))
			.map((stmt: string) => stmt
				.replace("$name", str(name))
				.replace("$timestamp", num(timestamp)));
	}

	export function queryLibraryInfo(): string {
		return metadataGetAll;
	}

	export function updateLibraryInfoTimestampLastOpened(timestamp: number): string {
		return metadataUpdateTimestampLastOpened
			.replace("$newTimestamp", num(timestamp));
	}

}

function str(value: any): string {
	return "'" + value + "'";
}

function num(value: number): string {
	return "" + value;
}

