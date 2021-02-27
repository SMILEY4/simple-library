import { ImportStepImportTarget } from '../../main/service/item/importprocess/importStepImportTarget';
import { ImportTargetAction, ItemData } from '../../common/commonModels';
import { Test } from '../testutils/test';
import { FileSystemWrapperMock } from '../testutils/testMocks';
import { buildItemData } from '../testutils/testFactories';
import { allTrue, assertFileSystemWrapperInvocations, assertItemData } from '../testutils/testAssertions';

export class ImportFileHandlerTests {

    public static async testKeep() {
        await Test.runTest("handle file: keep", async () => {

            const fswMock: FileSystemWrapperMock = new FileSystemWrapperMock();
            const itemData: ItemData = buildItemData("path\\to\\my\\file.txt", "path\\to\\my\\file.txt");

            const resultItemData = await new ImportStepImportTarget(fswMock).handle(itemData, ImportTargetAction.KEEP);

            return allTrue([
                assertFileSystemWrapperInvocations(fswMock, [], []),
                assertItemData(itemData, resultItemData),
            ]);
        });
    }

    public static async testKeepRename() {
        await Test.runTest("handle file: keep but rename", async () => {

            const fswMock: FileSystemWrapperMock = new FileSystemWrapperMock();
            const itemData: ItemData = buildItemData("path\\to\\my\\oldFile.txt", "path\\to\\my\\newFile.txt");

            const resultItemData: ItemData = await new ImportStepImportTarget(fswMock).handle(itemData, ImportTargetAction.KEEP);

            return allTrue([
                assertFileSystemWrapperInvocations(fswMock, [{
                    source: "path\\to\\my\\oldFile.txt",
                    target: "path\\to\\my\\newFile.txt",
                }], []),
                assertItemData(itemData, resultItemData),
            ]);
        });
    }

    public static async testMove() {
        await Test.runTest("handle file: move", async () => {

            const fswMock: FileSystemWrapperMock = new FileSystemWrapperMock();
            const itemData: ItemData = buildItemData("path\\to\\my\\oldFile.txt", "path\\to\\new\\newFile.txt");

            const resultItemData: ItemData = await new ImportStepImportTarget(fswMock).handle(itemData, ImportTargetAction.MOVE);

            return allTrue([
                assertFileSystemWrapperInvocations(fswMock, [{
                    source: "path\\to\\my\\oldFile.txt",
                    target: "path\\to\\new\\newFile.txt",
                }], []),
                assertItemData(itemData, resultItemData),
            ]);

        });
    }

    public static async testCopy() {
        await Test.runTest("handle file: copy", async () => {

            const fswMock: FileSystemWrapperMock = new FileSystemWrapperMock();
            const itemData: ItemData = buildItemData("path\\to\\my\\oldFile.txt", "path\\to\\new\\newFile.txt");

            const resultItemData: ItemData = await new ImportStepImportTarget(fswMock).handle(itemData, ImportTargetAction.COPY);

            return allTrue([
                assertFileSystemWrapperInvocations(fswMock, [], [{
                    source: "path\\to\\my\\oldFile.txt",
                    target: "path\\to\\new\\newFile.txt",
                }]),
                assertItemData(itemData, resultItemData),
            ]);
        });
    }

}