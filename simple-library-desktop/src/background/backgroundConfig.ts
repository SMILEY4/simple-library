// let database: Database | undefined;

import {RenderPingMsgSender} from "../common/messagingNew/pingMsgSender";
import {RendererPingMsgHandler} from "../common/messagingNew/pingMsgHandler";

const pingSender: RenderPingMsgSender = new RenderPingMsgSender();
const pingHandler: RendererPingMsgHandler = new RendererPingMsgHandler();

export function initBackground(): void {
	console.log("INIT BACKGROUND")

	pingHandler.init();

	console.log("RENDER PING MAIN", "hello from render")
	pingSender.ping("hello from render")
		.then((response: any) => console.log("RESPONSE FROM MAIN:", response))
		.catch((err: any) => console.log("ERROR FROM MAIN:", err))

	// rendererOnCommand(ipcRenderer, "test-background", (payload: any) => {
	// 	console.log("BACKGROUND: handle test command")
	// 	testDb("C:\\Users\\LukasRuegner\\Desktop\\testlibrary\\TestLib.db")
	// });
}

//
// function testDb(path: string): Promise<OpenLibraryMessage.ResponsePayload> {
// 	return Promise.resolve(null)
// 		.then(() => openDatabase(path, false))
// 		.then(() => {
// 			console.log("LIBRARY METADATA:")
// 			database.all("SELECT * FROM metadata;", (err, rows) => {
// 				if (err) {
// 					console.log("ERROR FETCHING LIB-METADATA: " + JSON.stringify(err))
// 				} else {
// 					console.log("RESULT FETCHING LIB-METADATA: " + JSON.stringify(rows))
// 				}
// 			});
// 		})
// 		.then(() => ({}))
// }
//
//
// function openDatabase(url: string, create: boolean): Promise<void> {
// 	const mode: number = create ? (OPEN_CREATE | OPEN_READWRITE) : OPEN_READWRITE;
// 	return new Promise((resolve, reject) => {
// 		database = new Database(url, mode, (error: any) => {
// 			error ? reject(error.message) : resolve()
// 		});
// 	})
// 		.then(() => {
// 			database.get("PRAGMA foreign_keys = ON");
// 			console.log('Opened db: ' + url);
// 		})
// 		.catch(error => {
// 			console.log('Error opening db "' + url + '": ' + error);
// 			throw error;
// 		})
// }