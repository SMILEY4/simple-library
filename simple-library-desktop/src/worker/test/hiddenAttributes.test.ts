// import {jest} from "@jest/globals";
// import {mockAttributeMetadataProvider, mockFileSystemWrapper} from "./mockSetup";
// import {DbAccess} from "../persistence/dbAcces";
// import {MemDbAccess} from "./memDbAccess";
// import {ActionCreateLibrary} from "../service/library/actionCreateLibrary";
// import {SQLiteDataRepository} from "../persistence/sqliteRepository";
// import {DataRepository} from "../service/dataRepository";
// import {ActionSetHiddenAttributes} from "../service/library/actionSetHiddenAttributes";
// import {ActionGetHiddenAttributes} from "../service/library/actionGetHiddenAttributes";
//
// describe("hidden-attributes", () => {
//
// 	describe("hide", () => {
//
// 		test("hide attributes", async () => {
// 			// given
// 			const [actionSetHiddenAttributes, actionGetHiddenAttributes, actionCreateLibrary, repository, dbAccess] = mockService();
// 			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
// 			// when
// 			const result: Promise<void> = actionSetHiddenAttributes.perform([
// 				attFileCreateDate(),
// 				attFileExtension(),
// 				attMIMEType()
// 			], "hide");
// 			// then
// 			await expect(result).resolves.toBeUndefined();
// 			await expect(actionGetHiddenAttributes.perform()).resolves.toEqual([
// 				{
// 					g0: "File",
// 					g1: "System",
// 					g2: "Time",
// 					id: "FileCreateDate",
// 					name: "FileCreateDate"
// 				},
// 				{
// 					g0: "File",
// 					g1: "File",
// 					g2: "Other",
// 					id: "FileTypeExtension",
// 					name: "FileTypeExtension"
// 				},
// 				{
// 					g0: "File",
// 					g1: "File",
// 					g2: "Other",
// 					id: "MIMEType",
// 					name: "MIMEType"
// 				}
// 			]);
// 		});
//
// 		test("hide some already hidden attributes", async () => {
// 			// given
// 			const [actionSetHiddenAttributes, actionGetHiddenAttributes, actionCreateLibrary, repository, dbAccess] = mockService();
// 			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
// 			await actionSetHiddenAttributes.perform([
// 				attFileExtension(),
// 				attMIMEType()
// 			], "hide");
// 			// when
// 			const result: Promise<void> = actionSetHiddenAttributes.perform([
// 				attFileCreateDate(),
// 				attFileExtension(),
// 				attMIMEType()
// 			], "hide");
// 			// then
// 			await expect(result).resolves.toBeUndefined();
// 			await expect(actionGetHiddenAttributes.perform()).resolves.toEqual([
// 				{
// 					g0: "File",
// 					g1: "System",
// 					g2: "Time",
// 					id: "FileCreateDate",
// 					name: "FileCreateDate"
// 				},
// 				{
// 					g0: "File",
// 					g1: "File",
// 					g2: "Other",
// 					id: "FileTypeExtension",
// 					name: "FileTypeExtension"
// 				},
// 				{
// 					g0: "File",
// 					g1: "File",
// 					g2: "Other",
// 					id: "MIMEType",
// 					name: "MIMEType"
// 				}
// 			]);
// 		});
//
// 		test("hide no attributes", async () => {
// 			// given
// 			const [actionSetHiddenAttributes, actionGetHiddenAttributes, actionCreateLibrary, repository, dbAccess] = mockService();
// 			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
// 			// when
// 			const result: Promise<void> = actionSetHiddenAttributes.perform([], "hide");
// 			// then
// 			await expect(result).resolves.toBeUndefined();
// 			await expect(actionGetHiddenAttributes.perform()).resolves.toEqual([]);
// 		});
//
// 	});
//
// 	describe("show", () => {
//
// 		test("show attributes", async () => {
// 			// given
// 			const [actionSetHiddenAttributes, actionGetHiddenAttributes, actionCreateLibrary, repository, dbAccess] = mockService();
// 			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
// 			await actionSetHiddenAttributes.perform([
// 				attFileCreateDate(),
// 				attFileExtension(),
// 				attMIMEType()
// 			], "hide");
// 			// when
// 			const result: Promise<void> = actionSetHiddenAttributes.perform([
// 				attFileCreateDate(),
// 				attFileExtension()
// 			], "show");
// 			// then
// 			await expect(result).resolves.toBeUndefined();
// 			await expect(actionGetHiddenAttributes.perform()).resolves.toEqual([
// 				{
// 					g0: "File",
// 					g1: "File",
// 					g2: "Other",
// 					id: "MIMEType",
// 					name: "MIMEType"
// 				}
// 			]);
// 		});
//
// 		test("show some not hidden attributes", async () => {
// 			// given
// 			const [actionSetHiddenAttributes, actionGetHiddenAttributes, actionCreateLibrary, repository, dbAccess] = mockService();
// 			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
// 			await actionSetHiddenAttributes.perform([
// 				attFileExtension(),
// 				attMIMEType()
// 			], "hide");
// 			// when
// 			const result: Promise<void> = actionSetHiddenAttributes.perform([
// 				attFileCreateDate(),
// 				attFileExtension()
// 			], "show");
// 			// then
// 			await expect(result).resolves.toBeUndefined();
// 			await expect(actionGetHiddenAttributes.perform()).resolves.toEqual([
// 				{
// 					g0: "File",
// 					g1: "File",
// 					g2: "Other",
// 					id: "MIMEType",
// 					name: "MIMEType"
// 				}
// 			]);
// 		});
//
// 		test("hide no attributes", async () => {
// 			// given
// 			const [actionSetHiddenAttributes, actionGetHiddenAttributes, actionCreateLibrary, repository, dbAccess] = mockService();
// 			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
// 			// when
// 			const result: Promise<void> = actionSetHiddenAttributes.perform([], "show");
// 			// then
// 			await expect(result).resolves.toBeUndefined();
// 			await expect(actionGetHiddenAttributes.perform()).resolves.toEqual([]);
// 		});
//
// 	});
//
// });
//
//
// function mockService(): [ActionSetHiddenAttributes, ActionGetHiddenAttributes, ActionCreateLibrary, DataRepository, DbAccess] {
// 	const dbAccess = new MemDbAccess();
// 	const fsWrapper = mockFileSystemWrapper();
// 	fsWrapper.existsFile = jest.fn().mockReturnValue(false) as any;
// 	const actionCreateLibrary = new ActionCreateLibrary(new SQLiteDataRepository(dbAccess), fsWrapper, mockAttributeMetadataProvider());
// 	const actionSetHiddenAttributes = new ActionSetHiddenAttributes(new SQLiteDataRepository(dbAccess));
// 	const actionGetHiddenAttributes = new ActionGetHiddenAttributes(new SQLiteDataRepository(dbAccess));
// 	return [actionSetHiddenAttributes, actionGetHiddenAttributes, actionCreateLibrary, new SQLiteDataRepository(dbAccess), dbAccess];
// }
//
//
// function attFileCreateDate() { // WRITABLE
// 	return sqlAttribute(["FileCreateDate", "FileCreateDate", "File", "System", "Time"]);
// }
//
// function attFileModifyDate() { // WRITABLE
// 	return sqlAttribute(["FileModifyDate", "FileModifyDate", "File", "System", "Time"]);
// }
//
// function attComment() { // WRITABLE
// 	return sqlAttribute(["Comment", "Comment", "File", "File", "Image"]);
// }
//
// function attFileAccessDate() { // read-only
// 	return sqlAttribute(["FileAccessDate", "FileAccessDate", "File", "System", "Time"]);
// }
//
// function attFileExtension() { // read-only
// 	return sqlAttribute(["FileTypeExtension", "FileTypeExtension", "File", "File", "Other"]);
// }
//
// function attMIMEType() { // read-only
// 	return sqlAttribute(["MIMEType", "MIMEType", "File", "File", "Other"]);
// }
//
// function sqlAttribute(key: [string, string, string, string, string]) {
// 	return {
// 		id: key[0],
// 		name: key[1],
// 		g0: key[2],
// 		g1: key[3],
// 		g2: key[4]
// 	};
// }