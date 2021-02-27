import { RenameTests } from './import/renameTests';
import { ImportFileHandlerTests } from './import/importFileHandlerTests';
import { ImportValidationTests } from './import/importValidationTests';

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

        await ImportValidationTests.importValid();
        await ImportValidationTests.importInvalidTarget();
        await ImportValidationTests.importInvalidTargetNotExists();
        await ImportValidationTests.importInvalidRenameTextEmpty();
        await ImportValidationTests.importInvalidRenameNumberFromEmpty();
        await ImportValidationTests.importInvalidRenameNumberFromNaN();

        process.exit(0);
    }

}