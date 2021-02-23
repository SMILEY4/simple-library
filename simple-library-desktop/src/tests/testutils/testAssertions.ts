import { FileSystemWrapperMock } from './testMocks';
import { ItemData } from '../../common/commonModels';

export function assertEqual(expected: any, actual: any): boolean {
    if (expected === actual) {
        return true;
    } else {
        console.log("assert equals failed. Expected: " + JSON.stringify(expected) + " Actual: " + JSON.stringify(actual));
        return false;
    }
}

export function allTrue(values: boolean[]): boolean {
    if (values.every(v => v === true)) {
        return true;
    } else {
        console.log("assert all true failed.");
        return false;
    }
}

export function assertFileSystemWrapperInvocations(fswMock: FileSystemWrapperMock, move: any[], copy: any[]): boolean {

    if (fswMock.getMoveInvocations().length !== move.length) {
        return false;
    }
    if (fswMock.getCopyInvocations().length !== copy.length) {
        return false;
    }

    for (let i = 0; i < move.length; i++) {
        const expected = move[i];
        const inv = fswMock.getMoveInvocations()[i];
        if (expected.source !== inv.source || expected.target !== inv.target) {
            return false;
        }
    }

    for (let i = 0; i < copy.length; i++) {
        const expected = copy[i];
        const inv = fswMock.getCopyInvocations()[i];
        if (expected.source !== inv.source || expected.target !== inv.target) {
            return false;
        }
    }

    return true;
}


export function assertItemData(expected: ItemData, actual: ItemData) {
    return expected.id === actual.id
        && expected.timestamp === actual.timestamp
        && expected.orgFilepath === actual.orgFilepath
        && expected.filepath === actual.filepath
        && expected.hash === actual.hash
        && expected.thumbnail === actual.thumbnail;
}