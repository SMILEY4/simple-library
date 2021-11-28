import {jest} from "@jest/globals";
import {
	ATT_ID_FILE_CREATE_DATE,
	ATT_ID_FILE_EXTENSION,
	ATT_ID_MIME_TYPE,
	mockAttributeMetadataProvider,
	mockFileSystemWrapper
} from "./testUtils";
import {DbAccess} from "../persistence/dbAcces";
import {MemDbAccess} from "./memDbAccess";
import {ActionCreateLibrary} from "../service/library/actionCreateLibrary";
import {SQLiteDataRepository} from "../persistence/sqliteRepository";
import {DataRepository} from "../service/dataRepository";
import {ActionSetHiddenAttributes} from "../service/library/actionSetHiddenAttributes";
import {ActionGetHiddenAttributes} from "../service/library/actionGetHiddenAttributes";

describe("hidden-attributes", () => {

	describe("hide", () => {

		test("hide attributes", async () => {
			// given
			const [actionSetHiddenAttributes, actionGetHiddenAttributes, actionCreateLibrary, repository, dbAccess] = mockService();
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			// when
			const result: Promise<void> = actionSetHiddenAttributes.perform([ATT_ID_FILE_CREATE_DATE, ATT_ID_FILE_EXTENSION, ATT_ID_MIME_TYPE], "hide");
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetHiddenAttributes.perform()).resolves.toEqual([
				{
					attId: ATT_ID_FILE_CREATE_DATE,
					key: {
						g0: "File",
						g1: "System",
						g2: "Time",
						id: "FileCreateDate",
						name: "FileCreateDate"
					},
					type: "?",
					writable: true,
				},
				{
					attId: ATT_ID_FILE_EXTENSION,
					key: {
						g0: "File",
						g1: "File",
						g2: "Other",
						id: "FileTypeExtension",
						name: "FileTypeExtension"
					},
					type: "?",
					writable: false,
				},
				{
					attId: ATT_ID_MIME_TYPE,
					key: {
						g0: "File",
						g1: "File",
						g2: "Other",
						id: "MIMEType",
						name: "MIMEType"
					},
					type: "?",
					writable: false,
				}
			]);
		});

		test("hide some already hidden attributes", async () => {
			// given
			const [actionSetHiddenAttributes, actionGetHiddenAttributes, actionCreateLibrary, repository, dbAccess] = mockService();
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await actionSetHiddenAttributes.perform([ATT_ID_FILE_EXTENSION, ATT_ID_MIME_TYPE], "hide");
			// when
			const result: Promise<void> = actionSetHiddenAttributes.perform([ATT_ID_FILE_CREATE_DATE, ATT_ID_FILE_EXTENSION, ATT_ID_MIME_TYPE], "hide");
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetHiddenAttributes.perform()).resolves.toEqual([
				{
					attId: ATT_ID_FILE_CREATE_DATE,
					key: {
						g0: "File",
						g1: "System",
						g2: "Time",
						id: "FileCreateDate",
						name: "FileCreateDate"
					},
					type: "?",
					writable: true,
				},
				{
					attId: ATT_ID_FILE_EXTENSION,
					key: {
						g0: "File",
						g1: "File",
						g2: "Other",
						id: "FileTypeExtension",
						name: "FileTypeExtension"
					},
					type: "?",
					writable: false,
				},
				{
					attId: ATT_ID_MIME_TYPE,
					key: {
						g0: "File",
						g1: "File",
						g2: "Other",
						id: "MIMEType",
						name: "MIMEType"
					},
					type: "?",
					writable: false,
				}
			]);
		});

		test("hide no attributes", async () => {
			// given
			const [actionSetHiddenAttributes, actionGetHiddenAttributes, actionCreateLibrary, repository, dbAccess] = mockService();
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			// when
			const result: Promise<void> = actionSetHiddenAttributes.perform([], "hide");
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetHiddenAttributes.perform()).resolves.toEqual([]);
		});

	});

	describe("show", () => {

		test("show attributes", async () => {
			// given
			const [actionSetHiddenAttributes, actionGetHiddenAttributes, actionCreateLibrary, repository, dbAccess] = mockService();
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await actionSetHiddenAttributes.perform([ATT_ID_FILE_CREATE_DATE, ATT_ID_FILE_EXTENSION, ATT_ID_MIME_TYPE], "hide");
			// when
			const result: Promise<void> = actionSetHiddenAttributes.perform([ATT_ID_FILE_CREATE_DATE, ATT_ID_FILE_EXTENSION], "show");
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetHiddenAttributes.perform()).resolves.toEqual([
				{
					attId: ATT_ID_MIME_TYPE,
					key: {
						g0: "File",
						g1: "File",
						g2: "Other",
						id: "MIMEType",
						name: "MIMEType"
					},
					type: "?",
					writable: false,
				}
			]);
		});

		test("show some not hidden attributes", async () => {
			// given
			const [actionSetHiddenAttributes, actionGetHiddenAttributes, actionCreateLibrary, repository, dbAccess] = mockService();
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await actionSetHiddenAttributes.perform([ATT_ID_FILE_EXTENSION, ATT_ID_MIME_TYPE], "hide");
			// when
			const result: Promise<void> = actionSetHiddenAttributes.perform([ATT_ID_FILE_CREATE_DATE, ATT_ID_FILE_EXTENSION], "show");
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetHiddenAttributes.perform()).resolves.toEqual([
				{
					attId: ATT_ID_MIME_TYPE,
					key: {
						g0: "File",
						g1: "File",
						g2: "Other",
						id: "MIMEType",
						name: "MIMEType"
					},
					type: "?",
					writable: false,
				}
			]);
		});

		test("hide no attributes", async () => {
			// given
			const [actionSetHiddenAttributes, actionGetHiddenAttributes, actionCreateLibrary, repository, dbAccess] = mockService();
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			// when
			const result: Promise<void> = actionSetHiddenAttributes.perform([], "show");
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetHiddenAttributes.perform()).resolves.toEqual([]);
		});

	});

});


function mockService(): [ActionSetHiddenAttributes, ActionGetHiddenAttributes, ActionCreateLibrary, DataRepository, DbAccess] {
	const dbAccess = new MemDbAccess();
	const fsWrapper = mockFileSystemWrapper();
	fsWrapper.existsFile = jest.fn().mockReturnValue(false) as any;
	const actionCreateLibrary = new ActionCreateLibrary(new SQLiteDataRepository(dbAccess), fsWrapper, mockAttributeMetadataProvider(true));
	const actionSetHiddenAttributes = new ActionSetHiddenAttributes(new SQLiteDataRepository(dbAccess));
	const actionGetHiddenAttributes = new ActionGetHiddenAttributes(new SQLiteDataRepository(dbAccess));
	return [actionSetHiddenAttributes, actionGetHiddenAttributes, actionCreateLibrary, new SQLiteDataRepository(dbAccess), dbAccess];
}