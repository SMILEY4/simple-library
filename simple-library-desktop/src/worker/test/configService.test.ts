import {FileSystemWrapper} from "../service/fileSystemWrapper";
import {mockConfigAccess, mockFileSystemWrapper} from "./mockSetup";
import {ConfigAccess} from "../persistence/configAccess";
import {jest} from "@jest/globals";
import {ActionOpenConfig} from "../service/config/actionOpenConfig";
import {ActionGetExiftoolInfo} from "../service/config/actionGetExiftoolInfo";
import {ActionSetTheme} from "../service/config/actionSetTheme";
import {ActionGetTheme} from "../service/config/actionGetTheme";
import {ActionGetLastOpened} from "../service/config/actionGetLastOpened";
import {ActionAddToLastOpened} from "../service/config/actionAddToLastOpened";
import {ExiftoolInfo} from "../service/config/configCommons";

describe("config-service", () => {


	describe("open", () => {

		test("open config", async () => {
			// given
			const configLocation = "path/to/my/config.json";
			const [configAccess, fsWrapper] = mockConfigService();
			const actionOpenConfig = new ActionOpenConfig(configAccess, fsWrapper);
			mockConfigFileLocation(configAccess, configLocation);
			// when
			const result: Promise<void> = actionOpenConfig.perform();
			// then
			await expect(result).resolves.toBeUndefined();
			expect(fsWrapper.open).toHaveBeenCalledWith(configLocation);
		});

	});


	describe("exiftool", () => {

		test("get exiftool info", () => {
			// given
			const location = "path/to/my/exiftool.exe";
			const [configAccess] = mockConfigService();
			const actionGetExiftoolInfo = new ActionGetExiftoolInfo(configAccess);
			mockGetConfigValue(configAccess, {exiftool: location});
			// when
			const result: ExiftoolInfo = actionGetExiftoolInfo.perform();
			// then
			expect(result).toStrictEqual({location: location, defined: true});
		});


		test("get exiftool info when not defined", () => {
			// given
			const [configAccess] = mockConfigService();
			const actionGetExiftoolInfo = new ActionGetExiftoolInfo(configAccess);
			mockGetConfigValue(configAccess, {});
			// when
			const result: ExiftoolInfo = actionGetExiftoolInfo.perform();
			// then
			expect(result).toStrictEqual({location: null, defined: false});
		});

	});


	describe("theme", () => {

		test("set and get theme", () => {
			// given
			const [configAccess] = mockConfigService();
			const actionSetTheme = new ActionSetTheme(configAccess);
			const actionGetTheme = new ActionGetTheme(configAccess);
			const store: any = {};
			mockSetConfigValue(configAccess, store);
			mockGetConfigValue(configAccess, store);
			// when
			actionSetTheme.perform("dark");
			// then
			expect(actionGetTheme.perform()).toBe("dark");
			// when
			actionSetTheme.perform("light");
			// then
			expect(actionGetTheme.perform()).toBe("light");
		});

	});


	describe("last opened", () => {

		test("add and get last opened", () => {
			const [configAccess] = mockConfigService();
			const actionGetLastOpened = new ActionGetLastOpened(configAccess);
			const actionAddToLastOpened = new ActionAddToLastOpened(configAccess);
			const store: any = {};
			mockSetConfigValue(configAccess, store);
			mockGetConfigValue(configAccess, store);

			expect(actionGetLastOpened.perform()).toStrictEqual([]);

			actionAddToLastOpened.perform("path/to/a", "A");
			expect(actionGetLastOpened.perform()).toStrictEqual([{path: "path/to/a", name: "A"}]);

			actionAddToLastOpened.perform("path/to/b", "B");
			actionAddToLastOpened.perform("path/to/c", "C");
			expect(actionGetLastOpened.perform()).toStrictEqual([
				{path: "path/to/c", name: "C"},
				{path: "path/to/b", name: "B"},
				{path: "path/to/a", name: "A"}
			]);

			actionAddToLastOpened.perform("path/to/d", "D");
			expect(actionGetLastOpened.perform()).toStrictEqual([
				{path: "path/to/d", name: "D"},
				{path: "path/to/c", name: "C"},
				{path: "path/to/b", name: "B"}
			]);

			actionAddToLastOpened.perform("path/to/c", "C");
			expect(actionGetLastOpened.perform()).toStrictEqual([
				{path: "path/to/c", name: "C"},
				{path: "path/to/d", name: "D"},
				{path: "path/to/b", name: "B"}
			]);

		});

	});

});


function mockConfigService(): [ConfigAccess, FileSystemWrapper] {
	const configAccess = mockConfigAccess();
	const fsWrapper = mockFileSystemWrapper();
	return [configAccess, fsWrapper];
}

function mockConfigFileLocation(configAccess: ConfigAccess, location: string) {
	configAccess.getConfigFileLocation = jest.fn().mockReturnValue(location) as any;
}

function mockSetConfigValue(configAccess: ConfigAccess, store: any) {
	configAccess.setValue = jest.fn().mockImplementation((key: string, value: any) => {
		store[key] = value;
	});
}

function mockGetConfigValue(configAccess: ConfigAccess, store: any) {
	configAccess["getStoreValue"] = jest.fn().mockImplementation((key: string) => store[key]);
}