import {ImportProcessData, ImportResult, ImportService} from "../service/import/importService";
import {FileSystemWrapper} from "../service/fileSystemWrapper";
import {mockAttributeMetadataProvider, mockConfigAccess, mockDateNow, mockFileSystemWrapper} from "./mockSetup";
import {DbAccess} from "../persistence/dbAcces";
import {ImportDataValidator} from "../service/import/importDataValidator";
import {ImportStepFileHash} from "../service/import/importStepFileHash";
import {ImportStepThumbnail} from "../service/import/importStepThumbnail";
import {ImportStepRename} from "../service/import/importStepRename";
import {ImportStepImportTarget} from "../service/import/importStepImportTarget";
import {ImportStepMetadata} from "../service/import/importStepMetadata";
import {jest} from "@jest/globals";
import {MemDbAccess} from "./memDbAccess";
import {SQL} from "../persistence/sqlHandler";
import {ActionGetExiftoolInfo} from "../service/config/actionGetExiftoolInfo";
import {ActionCreateLibrary} from "../service/library/actionCreateLibrary";
import {SQLiteDataRepository} from "../persistence/sqliteRepository";
import {AttributeType} from "../service/item/itemCommon";

describe("import", () => {

    describe("fail import", () => {

        describe("invalid import target", () => {

            test("move (target does not exist)", async () => {
                // given
                const TIMESTAMP = mockDateNow(1234);
                const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
                await actionCreateLibrary.perform("TestLib", "path/to/test", false);
                mockDirsExist(fsWrapper, ["path/to"]);
                const importData: ImportProcessData = {
                    files: [
                        "path/to/file1.png",
                        "path/to/file2.png",
                        "path/to/file3.png"
                    ],
                    importTarget: {
                        action: "move",
                        targetDir: "new/path"
                    },
                    renameInstructions: {
                        doRename: false,
                        parts: []
                    }
                };
                // when
                const result: Promise<ImportResult> = importService.import(importData);
                // then
                await expect(result.then(r => ({...r, failureReason: "any"}))).resolves.toEqual({
                    timestamp: TIMESTAMP,
                    amountFiles: 3,
                    failed: true,
                    failureReason: "any",
                    encounteredErrors: false,
                    filesWithErrors: []
                });
                expect(fsWrapper.copy).toBeCalledTimes(0);
                expect(fsWrapper.move).toBeCalledTimes(0);
                expect(importService.isImportRunning()).toBeFalsy();
                await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([]);
            });


            test("copy (target does not exist)", async () => {
                // given
                const TIMESTAMP = mockDateNow(1234);
                const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
                await actionCreateLibrary.perform("TestLib", "path/to/test", false);
                mockDirsExist(fsWrapper, ["path/to"]);
                const importData: ImportProcessData = {
                    files: [
                        "path/to/file1.png",
                        "path/to/file2.png",
                        "path/to/file3.png"
                    ],
                    importTarget: {
                        action: "copy",
                        targetDir: "new/path"
                    },
                    renameInstructions: {
                        doRename: false,
                        parts: []
                    }
                };
                // when
                const result: Promise<ImportResult> = importService.import(importData);
                // then
                await expect(result.then(r => ({...r, failureReason: "any"}))).resolves.toEqual({
                    timestamp: TIMESTAMP,
                    amountFiles: 3,
                    failed: true,
                    failureReason: "any",
                    encounteredErrors: false,
                    filesWithErrors: []
                });
                expect(fsWrapper.copy).toBeCalledTimes(0);
                expect(fsWrapper.move).toBeCalledTimes(0);
                expect(importService.isImportRunning()).toBeFalsy();
                await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([]);
            });
        });


        describe("invalid rename instructions", () => {

            test("no parts provided", async () => {
                // given
                const TIMESTAMP = mockDateNow(1234);
                const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
                await actionCreateLibrary.perform("TestLib", "path/to/test", false);
                const importData: ImportProcessData = {
                    files: [
                        "path/to/file1.png",
                        "path/to/file2.png",
                        "path/to/file3.png"
                    ],
                    importTarget: {
                        action: "keep",
                        targetDir: ""
                    },
                    renameInstructions: {
                        doRename: true,
                        parts: []
                    }
                };
                // when
                const result: Promise<ImportResult> = importService.import(importData);
                // then
                await expect(result.then(r => ({...r, failureReason: "any"}))).resolves.toEqual({
                    timestamp: TIMESTAMP,
                    amountFiles: 3,
                    failed: true,
                    failureReason: "any",
                    encounteredErrors: false,
                    filesWithErrors: []
                });
                expect(fsWrapper.copy).toBeCalledTimes(0);
                expect(fsWrapper.move).toBeCalledTimes(0);
                expect(importService.isImportRunning()).toBeFalsy();
                await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([]);
            });


            test("invalid part combination - all 'nothing'", async () => {
                // given
                const TIMESTAMP = mockDateNow(1234);
                const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
                await actionCreateLibrary.perform("TestLib", "path/to/test", false);
                const importData: ImportProcessData = {
                    files: [
                        "path/to/file1.png",
                        "path/to/file2.png",
                        "path/to/file3.png"
                    ],
                    importTarget: {
                        action: "keep",
                        targetDir: ""
                    },
                    renameInstructions: {
                        doRename: true,
                        parts: [
                            {type: "nothing", value: ""},
                            {type: "nothing", value: ""}
                        ]
                    }
                };
                // when
                const result: Promise<ImportResult> = importService.import(importData);
                // then
                await expect(result.then(r => ({...r, failureReason: "any"}))).resolves.toEqual({
                    timestamp: TIMESTAMP,
                    amountFiles: 3,
                    failed: true,
                    failureReason: "any",
                    encounteredErrors: false,
                    filesWithErrors: []
                });
                expect(fsWrapper.copy).toBeCalledTimes(0);
                expect(fsWrapper.move).toBeCalledTimes(0);
                expect(importService.isImportRunning()).toBeFalsy();
                await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([]);
            });


            test("invalid text part: empty text provided", async () => {
                // given
                const TIMESTAMP = mockDateNow(1234);
                const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
                await actionCreateLibrary.perform("TestLib", "path/to/test", false);
                const importData: ImportProcessData = {
                    files: [
                        "path/to/file1.png",
                        "path/to/file2.png",
                        "path/to/file3.png"
                    ],
                    importTarget: {
                        action: "keep",
                        targetDir: ""
                    },
                    renameInstructions: {
                        doRename: true,
                        parts: [
                            {type: "text", value: "something"},
                            {type: "text", value: ""}
                        ]
                    }
                };
                // when
                const result: Promise<ImportResult> = importService.import(importData);
                // then
                await expect(result.then(r => ({...r, failureReason: "any"}))).resolves.toEqual({
                    timestamp: TIMESTAMP,
                    amountFiles: 3,
                    failed: true,
                    failureReason: "any",
                    encounteredErrors: false,
                    filesWithErrors: []
                });
                expect(fsWrapper.copy).toBeCalledTimes(0);
                expect(fsWrapper.move).toBeCalledTimes(0);
                expect(importService.isImportRunning()).toBeFalsy();
                await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([]);
            });


            test("invalid number-from part: empty value provided", async () => {
                // given
                const TIMESTAMP = mockDateNow(1234);
                const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
                await actionCreateLibrary.perform("TestLib", "path/to/test", false);
                const importData: ImportProcessData = {
                    files: [
                        "path/to/file1.png",
                        "path/to/file2.png",
                        "path/to/file3.png"
                    ],
                    importTarget: {
                        action: "keep",
                        targetDir: ""
                    },
                    renameInstructions: {
                        doRename: true,
                        parts: [
                            {type: "text", value: "something"},
                            {type: "number_from", value: ""}
                        ]
                    }
                };
                // when
                const result: Promise<ImportResult> = importService.import(importData);
                // then
                await expect(result.then(r => ({...r, failureReason: "any"}))).resolves.toEqual({
                    timestamp: TIMESTAMP,
                    amountFiles: 3,
                    failed: true,
                    failureReason: "any",
                    encounteredErrors: false,
                    filesWithErrors: []
                });
                expect(fsWrapper.copy).toBeCalledTimes(0);
                expect(fsWrapper.move).toBeCalledTimes(0);
                expect(importService.isImportRunning()).toBeFalsy();
                await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([]);
            });


            test("invalid number-from part: not a number", async () => {
                // given
                const TIMESTAMP = mockDateNow(1234);
                const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
                await actionCreateLibrary.perform("TestLib", "path/to/test", false);
                const importData: ImportProcessData = {
                    files: [
                        "path/to/file1.png",
                        "path/to/file2.png",
                        "path/to/file3.png"
                    ],
                    importTarget: {
                        action: "keep",
                        targetDir: ""
                    },
                    renameInstructions: {
                        doRename: true,
                        parts: [
                            {type: "text", value: "something"},
                            {type: "number_from", value: "hello 42 :)"}
                        ]
                    }
                };
                // when
                const result: Promise<ImportResult> = importService.import(importData);
                // then
                await expect(result.then(r => ({...r, failureReason: "any"}))).resolves.toEqual({
                    timestamp: TIMESTAMP,
                    amountFiles: 3,
                    failed: true,
                    failureReason: "any",
                    encounteredErrors: false,
                    filesWithErrors: []
                });
                expect(fsWrapper.copy).toBeCalledTimes(0);
                expect(fsWrapper.move).toBeCalledTimes(0);
                expect(importService.isImportRunning()).toBeFalsy();
                await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([]);
            });

            test("invalid number-from part: number must be >= 0", async () => {
                // given
                const TIMESTAMP = mockDateNow(1234);
                const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
                await actionCreateLibrary.perform("TestLib", "path/to/test", false);
                const importData: ImportProcessData = {
                    files: [
                        "path/to/file1.png",
                        "path/to/file2.png",
                        "path/to/file3.png"
                    ],
                    importTarget: {
                        action: "keep",
                        targetDir: ""
                    },
                    renameInstructions: {
                        doRename: true,
                        parts: [
                            {type: "text", value: "something"},
                            {type: "number_from", value: "-42"}
                        ]
                    }
                };
                // when
                const result: Promise<ImportResult> = importService.import(importData);
                // then
                await expect(result.then(r => ({...r, failureReason: "any"}))).resolves.toEqual({
                    timestamp: TIMESTAMP,
                    amountFiles: 3,
                    failed: true,
                    failureReason: "any",
                    encounteredErrors: false,
                    filesWithErrors: []
                });
                expect(fsWrapper.copy).toBeCalledTimes(0);
                expect(fsWrapper.move).toBeCalledTimes(0);
                expect(importService.isImportRunning()).toBeFalsy();
                await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([]);
            });

        });


        test("invalid filenames after rename: multiple files will be called the same", async () => {
            // given
            const TIMESTAMP = mockDateNow(1234);
            const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
            await actionCreateLibrary.perform("TestLib", "path/to/test", false);
            const importData: ImportProcessData = {
                files: [
                    "path/to/file1.png",
                    "path/to/file2.png",
                    "path/to/file3.png"
                ],
                importTarget: {
                    action: "keep",
                    targetDir: ""
                },
                renameInstructions: {
                    doRename: true,
                    parts: [
                        {type: "nothing", value: ""},
                        {type: "text", value: "something"},
                        {type: "text", value: "else"}
                    ]
                }
            };
            // when
            const result: Promise<ImportResult> = importService.import(importData);
            // then
            await expect(result.then(r => ({...r, failureReason: "any"}))).resolves.toEqual({
                timestamp: TIMESTAMP,
                amountFiles: 3,
                failed: true,
                failureReason: "any",
                encounteredErrors: false,
                filesWithErrors: []
            });
            expect(fsWrapper.copy).toBeCalledTimes(0);
            expect(fsWrapper.move).toBeCalledTimes(0);
            expect(importService.isImportRunning()).toBeFalsy();
            await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([]);
        });

        test("import already running", async () => {
            // given
            const TIMESTAMP = mockDateNow(1234);
            const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
            await actionCreateLibrary.perform("TestLib", "path/to/test", false);
            const importData: ImportProcessData = {
                files: [
                    "path/to/file1.png",
                    "path/to/file2.png",
                    "path/to/file3.png"
                ],
                importTarget: {
                    action: "keep",
                    targetDir: ""
                },
                renameInstructions: {
                    doRename: false,
                    parts: []
                }
            };
            // when
            importService["importRunning"] = true;
            const result: Promise<ImportResult> = importService.import(importData);
            // then
            await expect(result.then(r => ({...r, failureReason: "any"}))).resolves.toEqual({
                timestamp: TIMESTAMP,
                amountFiles: 3,
                failed: true,
                failureReason: "any",
                encounteredErrors: false,
                filesWithErrors: []
            });
            expect(fsWrapper.copy).toBeCalledTimes(0);
            expect(fsWrapper.move).toBeCalledTimes(0);
            expect(importService.isImportRunning()).toBeTruthy();
            await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([]);
        });


    });


    describe("import with errors", () => {

        test("move (file already exists)", async () => {
            // given
            const TIMESTAMP = mockDateNow(1234);
            const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
            mockDirsExist(fsWrapper, ["new/target/directory"]);
            mockFilesExist(fsWrapper, ["new\\target\\directory\\file2.png"]);
            await actionCreateLibrary.perform("TestLib", "path/to/test", false);
            const importData: ImportProcessData = {
                files: [
                    "path/to/file1.png",
                    "path/to/file2.png",
                    "path/to/file3.png"
                ],
                importTarget: {
                    action: "move",
                    targetDir: "new/target/directory"
                },
                renameInstructions: {
                    doRename: false,
                    parts: []
                }
            };
            // when
            const result: Promise<ImportResult> = importService.import(importData);
            // then
            await expect(result).resolves.toEqual({
                timestamp: TIMESTAMP,
                amountFiles: 3,
                failed: false,
                failureReason: "",
                encounteredErrors: true,
                filesWithErrors: [["path/to/file2.png", "mocked err: file already exists"]]
            });
            expect(fsWrapper.move).toBeCalledTimes(3);
            expect(fsWrapper.move).toHaveBeenCalledWith("path/to/file1.png", "new\\target\\directory\\file1.png", false);
            expect(fsWrapper.move).toHaveBeenCalledWith("path/to/file3.png", "new\\target\\directory\\file3.png", false);
            expect(fsWrapper.copy).toBeCalledTimes(0);
            expect(importService.isImportRunning()).toBeFalsy();
            await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([
                item(1, "new\\target\\directory\\file1.png", TIMESTAMP),
                item(2, "new\\target\\directory\\file3.png", TIMESTAMP)
            ]);
        });


        test("copy (file already exists)", async () => {
            // given
            const TIMESTAMP = mockDateNow(1234);
            const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
            mockDirsExist(fsWrapper, ["new/target/directory"]);
            mockFilesExist(fsWrapper, ["new\\target\\directory\\file2.png"]);
            await actionCreateLibrary.perform("TestLib", "path/to/test", false);
            const importData: ImportProcessData = {
                files: [
                    "path/to/file1.png",
                    "path/to/file2.png",
                    "path/to/file3.png"
                ],
                importTarget: {
                    action: "copy",
                    targetDir: "new/target/directory"
                },
                renameInstructions: {
                    doRename: false,
                    parts: []
                }
            };
            // when
            const result: Promise<ImportResult> = importService.import(importData);
            // then
            await expect(result).resolves.toEqual({
                timestamp: TIMESTAMP,
                amountFiles: 3,
                failed: false,
                failureReason: "",
                encounteredErrors: true,
                filesWithErrors: [["path/to/file2.png", "mocked err: file already exists"]]
            });
            expect(fsWrapper.copy).toBeCalledTimes(3);
            expect(fsWrapper.copy).toHaveBeenCalledWith("path/to/file1.png", "new\\target\\directory\\file1.png", false);
            expect(fsWrapper.copy).toHaveBeenCalledWith("path/to/file3.png", "new\\target\\directory\\file3.png", false);
            expect(fsWrapper.move).toBeCalledTimes(0);
            expect(importService.isImportRunning()).toBeFalsy();
            await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([
                item(1, "new\\target\\directory\\file1.png", TIMESTAMP),
                item(2, "new\\target\\directory\\file3.png", TIMESTAMP)
            ]);
        });

        test("rename (file already exists)", async () => {
            // given
            const TIMESTAMP = mockDateNow(1234);
            const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
            mockDirsExist(fsWrapper, ["new/target/directory"]);
            mockFilesExist(fsWrapper, ["new\\target\\directory\\file2_renamed.png"]);
            await actionCreateLibrary.perform("TestLib", "path/to/test", false);
            const importData: ImportProcessData = {
                files: [
                    "path/to/file1.png",
                    "path/to/file2.png",
                    "path/to/file3.png"
                ],
                importTarget: {
                    action: "copy",
                    targetDir: "new/target/directory"
                },
                renameInstructions: {
                    doRename: true,
                    parts: [
                        {type: "original_filename", value: ""},
                        {type: "text", value: "_renamed"}
                    ]
                }
            };
            // when
            const result: Promise<ImportResult> = importService.import(importData);
            // then
            await expect(result).resolves.toEqual({
                timestamp: TIMESTAMP,
                amountFiles: 3,
                failed: false,
                failureReason: "",
                encounteredErrors: true,
                filesWithErrors: [["path/to/file2.png", "mocked err: file already exists"]]
            });
            expect(fsWrapper.copy).toBeCalledTimes(3);
            expect(fsWrapper.copy).toHaveBeenCalledWith("path/to/file1.png", "new\\target\\directory\\file1_renamed.png", false);
            expect(fsWrapper.copy).toHaveBeenCalledWith("path/to/file3.png", "new\\target\\directory\\file3_renamed.png", false);
            expect(fsWrapper.move).toBeCalledTimes(0);
            expect(importService.isImportRunning()).toBeFalsy();
            await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([
                item(1, "new\\target\\directory\\file1_renamed.png", TIMESTAMP),
                item(2, "new\\target\\directory\\file3_renamed.png", TIMESTAMP)
            ]);
        });

    });


    describe("successfully import", () => {

        test("keep, no rename", async () => {
            // given
            const TIMESTAMP = mockDateNow(1234);
            const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
            mockFilesExist(fsWrapper, []);
            await actionCreateLibrary.perform("TestLib", "path/to/test", false);
            const importData: ImportProcessData = {
                files: [
                    "path/to/file1.png",
                    "path/to/file2.png",
                    "path/to/file3.png"
                ],
                importTarget: {
                    action: "keep",
                    targetDir: ""
                },
                renameInstructions: {
                    doRename: false,
                    parts: []
                }
            };
            // when
            const result: Promise<ImportResult> = importService.import(importData);
            // then
            await expect(result).resolves.toEqual({
                timestamp: TIMESTAMP,
                amountFiles: 3,
                failed: false,
                failureReason: "",
                encounteredErrors: false,
                filesWithErrors: []
            });
            expect(fsWrapper.copy).toBeCalledTimes(0);
            expect(fsWrapper.move).toBeCalledTimes(0);
            expect(importService.isImportRunning()).toBeFalsy();
            await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([
                item(1, "path\\to\\file1.png", TIMESTAMP),
                item(2, "path\\to\\file2.png", TIMESTAMP),
                item(3, "path\\to\\file3.png", TIMESTAMP)
            ]);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(1))).resolves.toEqual([
                attribute("attribText", "text value", "text", 0),
                attribute("attribNumber", "42.1", "number", 0),
                attribute("attribBool", "true", "boolean", 0),
                attribute("attribDate", "2021-08-01T18:22:13", "date", 0),
                attribute("attribList", "entry1;entry2;42;true", "list", 0),
                attribute("attribObj.subAttribText", "text value", "text", 0),
                attribute("attribObj.subAttribNumber", "42.1", "number", 0),
                attribute("attribObj.subAttribBool", "true", "boolean", 0),
                attribute("attribObj.subAttribDate", "2021-08-01T18:22:13", "date", 0),
                attribute("attribObj.subAttribList", "entry1;entry2;42;true", "list", 0)
            ]);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(2))).resolves.toHaveLength(10);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(3))).resolves.toHaveLength(10);
        });


        test("copy, no rename", async () => {
            // given
            const TIMESTAMP = mockDateNow(1234);
            const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
            mockFilesExist(fsWrapper, []);
            mockDirsExist(fsWrapper, ["new/target/directory"]);
            await actionCreateLibrary.perform("TestLib", "path/to/test", false);
            const importData: ImportProcessData = {
                files: [
                    "path/to/file1.png",
                    "path/to/file2.png",
                    "path/to/file3.png"
                ],
                importTarget: {
                    action: "copy",
                    targetDir: "new/target/directory"
                },
                renameInstructions: {
                    doRename: false,
                    parts: []
                }
            };
            // when
            const result: Promise<ImportResult> = importService.import(importData);
            // then
            await expect(result).resolves.toEqual({
                timestamp: TIMESTAMP,
                amountFiles: 3,
                failed: false,
                failureReason: "",
                encounteredErrors: false,
                filesWithErrors: []
            });
            expect(fsWrapper.copy).toBeCalledTimes(3);
            expect(fsWrapper.copy).toHaveBeenCalledWith("path/to/file1.png", "new\\target\\directory\\file1.png", false);
            expect(fsWrapper.copy).toHaveBeenCalledWith("path/to/file2.png", "new\\target\\directory\\file2.png", false);
            expect(fsWrapper.copy).toHaveBeenCalledWith("path/to/file3.png", "new\\target\\directory\\file3.png", false);
            expect(fsWrapper.move).toBeCalledTimes(0);
            expect(importService.isImportRunning()).toBeFalsy();
            await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([
                item(1, "new\\target\\directory\\file1.png", TIMESTAMP),
                item(2, "new\\target\\directory\\file2.png", TIMESTAMP),
                item(3, "new\\target\\directory\\file3.png", TIMESTAMP)
            ]);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(1))).resolves.toHaveLength(10);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(2))).resolves.toHaveLength(10);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(3))).resolves.toHaveLength(10);
        });


        test("move, no rename", async () => {
            // given
            const TIMESTAMP = mockDateNow(1234);
            const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
            mockFilesExist(fsWrapper, []);
            mockDirsExist(fsWrapper, ["new/target/directory"]);
            await actionCreateLibrary.perform("TestLib", "path/to/test", false);
            const importData: ImportProcessData = {
                files: [
                    "path/to/file1.png",
                    "path/to/file2.png",
                    "path/to/file3.png"
                ],
                importTarget: {
                    action: "move",
                    targetDir: "new/target/directory"
                },
                renameInstructions: {
                    doRename: false,
                    parts: []
                }
            };
            // when
            const result: Promise<ImportResult> = importService.import(importData);
            // then
            await expect(result).resolves.toEqual({
                timestamp: TIMESTAMP,
                amountFiles: 3,
                failed: false,
                failureReason: "",
                encounteredErrors: false,
                filesWithErrors: []
            });
            expect(fsWrapper.move).toBeCalledTimes(3);
            expect(fsWrapper.move).toHaveBeenCalledWith("path/to/file1.png", "new\\target\\directory\\file1.png", false);
            expect(fsWrapper.move).toHaveBeenCalledWith("path/to/file2.png", "new\\target\\directory\\file2.png", false);
            expect(fsWrapper.move).toHaveBeenCalledWith("path/to/file3.png", "new\\target\\directory\\file3.png", false);
            expect(fsWrapper.copy).toBeCalledTimes(0);
            expect(importService.isImportRunning()).toBeFalsy();
            await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([
                item(1, "new\\target\\directory\\file1.png", TIMESTAMP),
                item(2, "new\\target\\directory\\file2.png", TIMESTAMP),
                item(3, "new\\target\\directory\\file3.png", TIMESTAMP)
            ]);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(1))).resolves.toHaveLength(10);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(2))).resolves.toHaveLength(10);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(3))).resolves.toHaveLength(10);
        });


        test("keep, with rename", async () => {
            // given
            const TIMESTAMP = mockDateNow(1234);
            const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
            mockFilesExist(fsWrapper, []);
            await actionCreateLibrary.perform("TestLib", "path/to/test", false);
            const importData: ImportProcessData = {
                files: [
                    "path/to/file1.png",
                    "path/to/file2.png",
                    "path/to/file3.png"
                ],
                importTarget: {
                    action: "keep",
                    targetDir: ""
                },
                renameInstructions: {
                    doRename: true,
                    parts: [
                        {type: "nothing", value: ""},
                        {type: "original_filename", value: ""},
                        {type: "nothing", value: ""},
                        {type: "text", value: "_txt_"},
                        {type: "number_from", value: "8"},
                        {type: "nothing", value: ""}
                    ]
                }
            };
            // when
            const result: Promise<ImportResult> = importService.import(importData);
            // then
            await expect(result).resolves.toEqual({
                timestamp: TIMESTAMP,
                amountFiles: 3,
                failed: false,
                failureReason: "",
                encounteredErrors: false,
                filesWithErrors: []
            });
            expect(fsWrapper.move).toBeCalledTimes(3);
            expect(fsWrapper.move).toHaveBeenCalledWith("path/to/file1.png", "path\\to\\file1_txt_8.png", false);
            expect(fsWrapper.move).toHaveBeenCalledWith("path/to/file2.png", "path\\to\\file2_txt_9.png", false);
            expect(fsWrapper.move).toHaveBeenCalledWith("path/to/file3.png", "path\\to\\file3_txt_10.png", false);
            expect(fsWrapper.copy).toBeCalledTimes(0);
            expect(importService.isImportRunning()).toBeFalsy();
            await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([
                item(1, "path\\to\\file1_txt_8.png", TIMESTAMP),
                item(2, "path\\to\\file2_txt_9.png", TIMESTAMP),
                item(3, "path\\to\\file3_txt_10.png", TIMESTAMP)
            ]);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(1))).resolves.toHaveLength(10);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(2))).resolves.toHaveLength(10);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(3))).resolves.toHaveLength(10);
        });


        test("copy, with rename", async () => {
            // given
            const TIMESTAMP = mockDateNow(1234);
            const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
            mockFilesExist(fsWrapper, []);
            mockDirsExist(fsWrapper, ["new/target/directory"]);
            await actionCreateLibrary.perform("TestLib", "path/to/test", false);
            const importData: ImportProcessData = {
                files: [
                    "path/to/file1.png",
                    "path/to/file2.png",
                    "path/to/file3.png"
                ],
                importTarget: {
                    action: "copy",
                    targetDir: "new/target/directory"
                },
                renameInstructions: {
                    doRename: true,
                    parts: [
                        {type: "nothing", value: ""},
                        {type: "original_filename", value: ""},
                        {type: "nothing", value: ""},
                        {type: "text", value: "_txt_"},
                        {type: "number_from", value: "8"},
                        {type: "nothing", value: ""}
                    ]
                }
            };
            // when
            const result: Promise<ImportResult> = importService.import(importData);
            // then
            await expect(result).resolves.toEqual({
                timestamp: TIMESTAMP,
                amountFiles: 3,
                failed: false,
                failureReason: "",
                encounteredErrors: false,
                filesWithErrors: []
            });
            expect(fsWrapper.copy).toBeCalledTimes(3);
            expect(fsWrapper.copy).toHaveBeenCalledWith("path/to/file1.png", "new\\target\\directory\\file1_txt_8.png", false);
            expect(fsWrapper.copy).toHaveBeenCalledWith("path/to/file2.png", "new\\target\\directory\\file2_txt_9.png", false);
            expect(fsWrapper.copy).toHaveBeenCalledWith("path/to/file3.png", "new\\target\\directory\\file3_txt_10.png", false);
            expect(fsWrapper.move).toBeCalledTimes(0);
            expect(importService.isImportRunning()).toBeFalsy();
            await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([
                item(1, "new\\target\\directory\\file1_txt_8.png", TIMESTAMP),
                item(2, "new\\target\\directory\\file2_txt_9.png", TIMESTAMP),
                item(3, "new\\target\\directory\\file3_txt_10.png", TIMESTAMP)
            ]);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(1))).resolves.toHaveLength(10);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(2))).resolves.toHaveLength(10);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(3))).resolves.toHaveLength(10);
        });


        test("move, with rename", async () => {
            // given
            const TIMESTAMP = mockDateNow(1234);
            const [importService, actionCreateLibrary, fsWrapper, dbAccess] = mockImportService();
            mockFilesExist(fsWrapper, []);
            mockDirsExist(fsWrapper, ["new/target/directory"]);
            await actionCreateLibrary.perform("TestLib", "path/to/test", false);
            const importData: ImportProcessData = {
                files: [
                    "path/to/file1.png",
                    "path/to/file2.png",
                    "path/to/file3.png"
                ],
                importTarget: {
                    action: "move",
                    targetDir: "new/target/directory"
                },
                renameInstructions: {
                    doRename: true,
                    parts: [
                        {type: "nothing", value: ""},
                        {type: "original_filename", value: ""},
                        {type: "nothing", value: ""},
                        {type: "text", value: "_txt_"},
                        {type: "number_from", value: "8"},
                        {type: "nothing", value: ""}
                    ]
                }
            };
            // when
            const result: Promise<ImportResult> = importService.import(importData);
            // then
            await expect(result).resolves.toEqual({
                timestamp: TIMESTAMP,
                amountFiles: 3,
                failed: false,
                failureReason: "",
                encounteredErrors: false,
                filesWithErrors: []
            });
            expect(fsWrapper.move).toBeCalledTimes(3);
            expect(fsWrapper.move).toHaveBeenCalledWith("path/to/file1.png", "new\\target\\directory\\file1_txt_8.png", false);
            expect(fsWrapper.move).toHaveBeenCalledWith("path/to/file2.png", "new\\target\\directory\\file2_txt_9.png", false);
            expect(fsWrapper.move).toHaveBeenCalledWith("path/to/file3.png", "new\\target\\directory\\file3_txt_10.png", false);
            expect(fsWrapper.copy).toBeCalledTimes(0);
            expect(importService.isImportRunning()).toBeFalsy();
            await expect(dbAccess.queryAll(SQL.queryItemsAll([]))).resolves.toEqual([
                item(1, "new\\target\\directory\\file1_txt_8.png", TIMESTAMP),
                item(2, "new\\target\\directory\\file2_txt_9.png", TIMESTAMP),
                item(3, "new\\target\\directory\\file3_txt_10.png", TIMESTAMP)
            ]);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(1))).resolves.toHaveLength(10);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(2))).resolves.toHaveLength(10);
            await expect(dbAccess.queryAll(SQL.queryItemAttributes(3))).resolves.toHaveLength(10);
        });

    });

});

function item(id: number, path: string, timestampImported: number): any {
    return {
        item_id: id,
        filepath: path,
        hash: "hashMock",
        thumbnail: "thumbnailMock",
        timestamp_imported: timestampImported,
        attributes: null
    };
}

function attribute(key: string, value: any, type: AttributeType, modified: boolean | number) {
    return {
        key: key,
        value: value,
        type: type,
        modified: modified
    };
}

function mockImportService(): [ImportService, ActionCreateLibrary, FileSystemWrapper, DbAccess] {
    const fsWrapper = mockFileSystemWrapper();
    const dbAccess = new MemDbAccess();
    const configAccess = mockConfigAccess();

    const stepHash = new ImportStepFileHash(fsWrapper);
    // @ts-ignore
    stepHash["computeHashWithAlgorithm"] = jest.fn().mockReturnValue(Promise.resolve("hashMock"));

    const stepThumbnail = new ImportStepThumbnail();
    // @ts-ignore
    stepThumbnail["createBase64Thumbnail"] = jest.fn().mockReturnValue(Promise.resolve("thumbnailMock"));

    // @ts-ignore
    ImportStepMetadata["createExiftoolProcess"] = jest.fn().mockReturnValue(mockExiftoolProcess());

    const importService: ImportService = new ImportService(
        new SQLiteDataRepository(dbAccess),
        new ImportDataValidator(fsWrapper),
        stepHash,
        stepThumbnail,
        new ImportStepRename(),
        new ImportStepImportTarget(fsWrapper),
        new ImportStepMetadata(new ActionGetExiftoolInfo(configAccess)),
        () => Promise.resolve()
    );
    const actionCreateLibrary = new ActionCreateLibrary(new SQLiteDataRepository(dbAccess), fsWrapper, mockAttributeMetadataProvider());
    return [importService, actionCreateLibrary, fsWrapper, dbAccess];
}

function mockExiftoolProcess(): any {
    return {
        open: () => Promise.resolve(),
        readMetadata: (path: any, options: any) => ({
            data: [{
                attribText: "text value",
                attribNumber: 42.1,
                attribBool: true,
                attribDate: "2021-08-01T18:22:13",
                attribList: [
                    "entry1", "entry2", 42, true
                ],
                attribObj: {
                    subAttribText: "text value",
                    subAttribNumber: 42.1,
                    subAttribBool: true,
                    subAttribDate: "2021-08-01T18:22:13",
                    subAttribList: [
                        "entry1", "entry2", 42, true
                    ]
                }
            }]
        }),
        close: () => Promise.resolve()
    };
}

function mockFilesExist(fsWrapper: FileSystemWrapper, paths: string[]) {
    fsWrapper["existsFile"] = jest.fn().mockImplementation((path: string) => {
        return paths.indexOf(path) !== -1;
    }) as any;
    fsWrapper["move"] = jest.fn().mockImplementation((src: string, tgt: string, allowOverwrite: boolean) => {
        if (!allowOverwrite && paths.indexOf(tgt) !== -1) {
            throw "mocked err: file already exists";
        } else {
            return tgt;
        }
    }) as any;
    fsWrapper["copy"] = jest.fn().mockImplementation((src: string, tgt: string, allowOverwrite: boolean) => {
        if (!allowOverwrite && paths.indexOf(tgt) !== -1) {
            throw "mocked err: file already exists";
        } else {
            return tgt;
        }
    }) as any;
}

function mockDirsExist(fsWrapper: FileSystemWrapper, paths: string[]) {
    fsWrapper["existsDir"] = jest.fn().mockImplementation((path: string) => {
        return paths.indexOf(path) !== -1;
    }) as any;
}
