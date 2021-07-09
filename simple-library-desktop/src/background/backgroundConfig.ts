import {GetLastOpenedLibrariesMessage, OpenLibraryMessage} from "../common/messaging/messagesLibrary";

import {ipcRenderer} from "electron";
import {Database, OPEN_CREATE, OPEN_READWRITE} from "sqlite3";
import {rendererOnCommand} from "../common/messaging/messages";

let database: Database | undefined;

export function initBackground(): void {
	console.log("INIT BACKGROUND", GetLastOpenedLibrariesMessage, OpenLibraryMessage)

	rendererOnCommand(ipcRenderer, "test-background", (payload: any) => {
		console.log("BACKGROUND: handle test command")
		testDb("C:\\Users\\LukasRuegner\\Desktop\\testlibrary\\TestLib.db")
	});

}


function testDb(path: string): Promise<OpenLibraryMessage.ResponsePayload> {
	return Promise.resolve(null)
		.then(() => openDatabase(path, false))
		.then(() => {
			console.log("LIBRARY METADATA:")
			database.all("SELECT * FROM metadata;", (err, rows) => {
				if (err) {
					console.log("ERROR FETCHING LIB-METADATA: " + JSON.stringify(err))
				} else {
					console.log("RESULT FETCHING LIB-METADATA: " + JSON.stringify(rows))
				}
			});
		})
		.then(() => ({}))
}


function openDatabase(url: string, create: boolean): Promise<void> {
	const mode: number = create ? (OPEN_CREATE | OPEN_READWRITE) : OPEN_READWRITE;
	return new Promise((resolve, reject) => {
		database = new Database(url, mode, (error: any) => {
			error ? reject(error.message) : resolve()
		});
	})
		.then(() => {
			database.get("PRAGMA foreign_keys = ON");
			console.log('Opened db: ' + url);
		})
		.catch(error => {
			console.log('Error opening db "' + url + '": ' + error);
			throw error;
		})
}