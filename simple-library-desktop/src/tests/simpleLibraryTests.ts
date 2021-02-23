import { RenameTests } from './import/renameTests';
import { ImportFileHandlerTests } from './import/importFileHandlerTests';

export class SimpleLibraryTests {

    public static async runAll() {
        console.log("Running all tests...");

        await RenameTests.testRenameSimple();
        await RenameTests.testRenameNumberFromLargeIndex();
        await RenameTests.testRenameHandleImportKeep();
        await RenameTests.testRenameHandleImportMove();
        await RenameTests.testNoRenameHandleImportKeep();
        await RenameTests.testNoRenameHandleImportMove();

        await ImportFileHandlerTests.testKeep();
        await ImportFileHandlerTests.testKeepRename();
        await ImportFileHandlerTests.testMove();
        await ImportFileHandlerTests.testCopy();

        process.exit(0);
    }

}