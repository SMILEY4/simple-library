import {FileSystemWrapper} from "../service/fileSystemWrapper";
import {mockConfigAccess, mockFileSystemWrapper} from "./mockSetup";
import {ConfigAccess} from "../persistence/configAccess";
import {ConfigService} from "../service/configService";
import {jest} from "@jest/globals";


test("open config", async () => {
	const configLocation = "path/to/my/config.json";
	const [configService, configAccess, fsWrapper] = mockConfigService();
	mockConfigFileLocation(configAccess, configLocation);

	await expect(configService.openConfig()).resolves.toBeUndefined();
	expect(fsWrapper.open).toHaveBeenCalledWith(configLocation);
});

test("get exiftool info", () => {
	const location = "path/to/my/exiftool.exe";
	const [configService, configAccess] = mockConfigService();
	mockGetConfigValue(configAccess, {exiftool: location});
	expect(configService.getExiftoolInfo()).toStrictEqual({location: location, defined: true});
});

test("get exiftool info when not defined", () => {
	const [configService, configAccess] = mockConfigService();
	mockGetConfigValue(configAccess, {});
	expect(configService.getExiftoolInfo()).toStrictEqual({location: null, defined: false});
});

test("set and get theme", () => {
	const store: any = {};
	const [configService, configAccess] = mockConfigService();
	mockSetConfigValue(configAccess, store);
	mockGetConfigValue(configAccess, store);
	configService.setTheme("dark");
	expect(configService.getTheme()).toBe("dark");
	configService.setTheme("light");
	expect(configService.getTheme()).toBe("light");
});

test("add and get last opened", () => {
	const store: any = {};
	const [configService, configAccess] = mockConfigService();
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
		{path: "path/to/b", name: "B"},
	]);

	configService.addLastOpened("path/to/c", "C");
	expect(configService.getLastOpened()).toStrictEqual([
		{path: "path/to/c", name: "C"},
		{path: "path/to/d", name: "D"},
		{path: "path/to/b", name: "B"},
	]);

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