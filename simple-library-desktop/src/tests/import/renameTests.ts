import { ImportStepRename } from '../../main/service/item/importprocess/importStepRename';
import { BulkRenameInstruction, FileTargetAction, ImportFileTarget, RenamePartType } from '../../common/commonModels';
import { startAsyncWithValue } from '../../common/AsyncCommon';
import { Test } from '../testutils/test';
import { buildItemData } from '../testutils/testFactories';
import { assertEqual, assertItemData } from '../testutils/testAssertions';

export class RenameTests {

    public static async testRenameSimple() {
        await Test.runTest("rename simple", async () => {
            const renameData: BulkRenameInstruction = RenameTests.genericBulkRenameData();
            const orgFilepath = "path/to/my/file.txt";
            const newFilepath = new ImportStepRename().getNewFilepath(orgFilepath, "path/to/my", 5, renameData);
            return startAsyncWithValue(assertEqual("path\\to\\my\\file_00015.txt", newFilepath));
        });
    }

    public static async testRenameNumberFromLargeIndex() {
        await Test.runTest("rename number_from with large index", () => {
            const renameData: BulkRenameInstruction = {
                doRename: true,
                parts: [
                    {
                        type: RenamePartType.NUMBER_FROM,
                        value: "1",
                    },
                ],
            };
            const orgFilepath = "path/to/my/file.txt";
            const newFilepath = new ImportStepRename().getNewFilepath(orgFilepath, "path/to/my", 123, renameData);
            return startAsyncWithValue(assertEqual("path\\to\\my\\124.txt", newFilepath));
        });
    }

    public static async testRenameHandleImportKeep() {
        await Test.runTest("rename and handle importprocess (action=keep)", async () => {
            const resultingItemData = await new ImportStepRename().handle(
                buildItemData("path/to/my/file.txt", ""),
                RenameTests.importFileHandleData(FileTargetAction.KEEP, ''),
                RenameTests.genericBulkRenameData(),
                5);
            return assertItemData(
                buildItemData("path/to/my/file.txt", "path\\to\\my\\file_00015.txt"),
                resultingItemData,
            );
        });
    }

    public static async testRenameHandleImportMove() {
        await Test.runTest("rename and handle importprocess (action=move)", async () => {
            const resultingItemData = await new ImportStepRename().handle(
                buildItemData("path\\to\\my\\file.txt", ""),
                RenameTests.importFileHandleData(FileTargetAction.MOVE, 'path/to/new'),
                RenameTests.genericBulkRenameData(),
                5);
            return assertItemData(
                buildItemData("path\\to\\new\\file_00015.txt", "path\\to\\my\\file.txt"),
                resultingItemData,
            );
        });
    }

    public static async testNoRenameHandleImportKeep() {
        await Test.runTest("no rename and handle importprocess (action=keep)", async () => {
            const resultingItemData = await new ImportStepRename().handle(
                buildItemData("path\\to\\my\\file.txt", ""),
                RenameTests.importFileHandleData(FileTargetAction.KEEP, ''),
                RenameTests.noRenameData(),
                5);
            return assertItemData(
                buildItemData("path\\to\\my\\file.txt", "path\\to\\my\\file.txt"),
                resultingItemData,
            );
        });
    }

    public static async testNoRenameHandleImportMove() {
        await Test.runTest("no rename and handle importprocess (action=move)", async () => {
            const resultingItemData = await new ImportStepRename().handle(
                buildItemData("path\\to\\my\\file.txt", ""),
                RenameTests.importFileHandleData(FileTargetAction.MOVE, 'path/to/new'),
                RenameTests.noRenameData(),
                5);
            return assertItemData(
                buildItemData("path\\to\\my\\file.txt", "path\\to\\new\\file.txt"),
                resultingItemData,
            );
        });
    }


    private static importFileHandleData(fileAction: FileTargetAction, targetDir: string): ImportFileTarget {
        return {
            action: fileAction,
            targetDir: targetDir,
        };
    }

    private static genericBulkRenameData(): BulkRenameInstruction {
        return {
            doRename: true,
            parts: [
                {
                    type: RenamePartType.ORIGINAL_FILENAME,
                    value: "",
                },
                {
                    type: RenamePartType.TEXT,
                    value: "_",
                },
                {
                    type: RenamePartType.NOTHING,
                    value: "",
                },
                {
                    type: RenamePartType.NUMBER_FROM,
                    value: "00010",
                },
            ],
        };
    }

    private static noRenameData(): BulkRenameInstruction {
        return {
            doRename: false,
            parts: [],
        };
    }

}