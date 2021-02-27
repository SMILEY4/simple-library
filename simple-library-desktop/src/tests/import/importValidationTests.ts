import { Test } from '../testutils/test';
import { ImportProcessData, ImportTargetAction, RenamePartType } from '../../common/commonModels';
import { startAsyncWithValue } from '../../common/AsyncCommon';
import { assertEqual } from '../testutils/testAssertions';
import { ImportDataValidator } from '../../main/service/item/importprocess/importDataValidator';
import { FileSystemWrapperMock } from '../testutils/testMocks';

export class ImportValidationTests {

    public static async importValid() {
        await Test.runTest("import valid", async () => {

            const fswMock: FileSystemWrapperMock = new FileSystemWrapperMock();
            const validator: ImportDataValidator = new ImportDataValidator(fswMock);

            const data: ImportProcessData = {
                files: ["file1", "file2", "file3"],
                importTarget: {
                    action: ImportTargetAction.COPY,
                    targetDir: "targetDir",
                },
                renameInstructions: {
                    doRename: true,
                    parts: [
                        {
                            type: RenamePartType.NOTHING,
                            value: "",
                        },
                        {
                            type: RenamePartType.ORIGINAL_FILENAME,
                            value: "",
                        },
                        {
                            type: RenamePartType.TEXT,
                            value: "file",
                        },
                        {
                            type: RenamePartType.NUMBER_FROM,
                            value: "000123",
                        },
                    ],
                },
            };

            return ImportValidationTests.assertIsValid(validator, data, true);
        });
    }


    public static async importInvalidTarget() {
        await Test.runTest("import invalid target (empty)", async () => {

            const fswMock: FileSystemWrapperMock = new FileSystemWrapperMock();
            const validator: ImportDataValidator = new ImportDataValidator(fswMock);

            const data: ImportProcessData = {
                files: ["file1", "file2", "file3"],
                importTarget: {
                    action: ImportTargetAction.COPY,
                    targetDir: "",
                },
                renameInstructions: {
                    doRename: true,
                    parts: [{
                        type: RenamePartType.ORIGINAL_FILENAME,
                        value: "",
                    }],
                },
            };

            return ImportValidationTests.assertIsValid(validator, data, false);
        });
    }


    public static async importInvalidTargetNotExists() {
        await Test.runTest("import invalid target (not exists)", async () => {

            const fswMock: FileSystemWrapperMock = new FileSystemWrapperMock().addUnknownPath("missing");
            const validator: ImportDataValidator = new ImportDataValidator(fswMock);

            const data: ImportProcessData = {
                files: ["file1", "file2", "file3"],
                importTarget: {
                    action: ImportTargetAction.COPY,
                    targetDir: "missing",
                },
                renameInstructions: {
                    doRename: true,
                    parts: [{
                        type: RenamePartType.ORIGINAL_FILENAME,
                        value: "",
                    }],
                },
            };

            return ImportValidationTests.assertIsValid(validator, data, false);
        });
    }

    public static async importInvalidRenameTextEmpty() {
        await Test.runTest("import invalid rename (text empty)", async () => {

            const fswMock: FileSystemWrapperMock = new FileSystemWrapperMock();
            const validator: ImportDataValidator = new ImportDataValidator(fswMock);

            const data: ImportProcessData = {
                files: ["file1", "file2", "file3"],
                importTarget: {
                    action: ImportTargetAction.KEEP,
                    targetDir: "",
                },
                renameInstructions: {
                    doRename: true,
                    parts: [{
                        type: RenamePartType.TEXT,
                        value: "",
                    }],
                },
            };

            return ImportValidationTests.assertIsValid(validator, data, false);
        });
    }


    public static async importInvalidRenameNumberFromEmpty() {
        await Test.runTest("import invalid rename (number-from empty)", async () => {

            const fswMock: FileSystemWrapperMock = new FileSystemWrapperMock();
            const validator: ImportDataValidator = new ImportDataValidator(fswMock);

            const data: ImportProcessData = {
                files: ["file1", "file2", "file3"],
                importTarget: {
                    action: ImportTargetAction.KEEP,
                    targetDir: "",
                },
                renameInstructions: {
                    doRename: true,
                    parts: [{
                        type: RenamePartType.NUMBER_FROM,
                        value: "",
                    }],
                },
            };

            return ImportValidationTests.assertIsValid(validator, data, false);
        });
    }


    public static async importInvalidRenameNumberFromNaN() {
        await Test.runTest("import invalid rename (number-from NaN)", async () => {

            const fswMock: FileSystemWrapperMock = new FileSystemWrapperMock();
            const validator: ImportDataValidator = new ImportDataValidator(fswMock);

            const data: ImportProcessData = {
                files: ["file1", "file2", "file3"],
                importTarget: {
                    action: ImportTargetAction.KEEP,
                    targetDir: "",
                },
                renameInstructions: {
                    doRename: true,
                    parts: [{
                        type: RenamePartType.NUMBER_FROM,
                        value: "abc",
                    }],
                },
            };

            return ImportValidationTests.assertIsValid(validator, data, false);
        });
    }

    private static assertIsValid(validator: ImportDataValidator, data: ImportProcessData, expected: boolean): Promise<boolean> {
        let isValid: boolean;
        try {
            validator.validate(data);
            isValid = true;
        } catch (e) {
            isValid = false;
        }
        return startAsyncWithValue(
            assertEqual(expected, isValid),
        );
    }

}