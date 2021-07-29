import {FileSystemWrapper} from "../service/fileSystemWrapper";
import {mockConfigAccess, mockFileSystemWrapper} from "./mockSetup";
import {ConfigAccess} from "../persistence/configAccess";
import {ConfigService, ExiftoolInfo} from "../service/configService";
import {jest} from "@jest/globals";

describe("config-service", () => {


	test("open config", async () => {
		// given
		const configLocation = "path/to/my/config.json";
		const [configService, configAccess, fsWrapper] = mockConfigService();
		mockConfigFileLocation(configAccess, configLocation);
		// when
		const result: Promise<void> = configService.openConfig();
		// then
		await expect(result).resolves.toBeUndefined();
		expect(fsWrapper.open).toHaveBeenCalledWith(configLocation);
	});

	test("get exiftool info", () => {
		// given
		const location = "path/to/my/exiftool.exe";
		const [configService, configAccess] = mockConfigService();
		mockGetConfigValue(configAccess, {exiftool: location});
		// when
		const result: ExiftoolInfo = configService.getExiftoolInfo();
		// then
		expect(result).toStrictEqual({location: location, defined: true});
	});

	test("get exiftool info when not defined", () => {
		// given
		const [configService, configAccess] = mockConfigService();
		mockGetConfigValue(configAccess, {});
		// when
		const result: ExiftoolInfo = configService.getExiftoolInfo();
		// then
		expect(result).toStrictEqual({location: null, defined: false});
	});

	test("set and get theme", () => {
		// given
		const [configService, configAccess] = mockConfigService();
		const store: any = {};
		mockSetConfigValue(configAccess, store);
		mockGetConfigValue(configAccess, store);
		// when
		configService.setTheme("dark");
		// then
		expect(configService.getTheme()).toBe("dark");
		// when
		configService.setTheme("light");
		// then
		expect(configService.getTheme()).toBe("light");
	});

	test("add and get last opened", () => {
		const [configService, configAccess] = mockConfigService();
		const store: any = {};
		mockSetConfigValue(configAccess, store);
		mockGetConfigValue(configAccess, store);

		expect(configService.getLastOpened()).toStrictEqual([]);

		configService.addLastOpened("path/to/a", "A");
		expect(configService.getLastOpened()).toStrictEqual([{path: "path/to/a", name: "A"}]);

		configService.addLastOpened("path/to/b", "B");
		configService.addLastOpened("path/to/c", "C");
		expect(configService.getLastOpened()).toStrictEqual([
			{path: "path/to/c", name: "C"},
			{path: "path/to/b", name: "B"},
			{path: "path/to/a", name: "A"}
		]);

		configService.addLastOpened("path/to/d", "D");
		expect(configService.getLastOpened()).toStrictEqual([
			{path: "path/to/d", name: "D"},
			{path: "path/to/c", name: "C"},
			{path: "path/to/b", name: "B"}
		]);

		configService.addLastOpened("path/to/c", "C");
		expect(configService.getLastOpened()).toStrictEqual([
			{path: "path/to/c", name: "C"},
			{path: "path/to/d", name: "D"},
			{path: "path/to/b", name: "B"}
		]);

	});

});

function mockConfigService(): [ConfigService, ConfigAccess, FileSystemWrapper] {
	const configAccess = mockConfigAccess();
	const fsWrapper = mockFileSystemWrapper();
	const configService: ConfigService = new ConfigService(configAccess, fsWrapper);
	return [configService, configAccess, fsWrapper];
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