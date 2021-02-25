import { FileSystemWrapper } from '../../main/service/utils/fileSystemWrapper';
import { startAsyncWithValue } from '../../common/AsyncCommon';
import { ReadStream } from 'fs';

export class FileSystemWrapperMock extends FileSystemWrapper {

    moveInvocations: any[] = [];
    copyInvocations: any[] = [];
    unknownPaths: string[] = [];


    public async move(source: string, target: string): Promise<string> {
        this.moveInvocations.push({ source: source, target: target });
        return startAsyncWithValue(target);
    }

    public async copy(source: string, target: string, allowOverwrite: boolean): Promise<string> {
        this.copyInvocations.push({ source: source, target: target });
        return startAsyncWithValue(target);
    }

    public createReadStream(filepath: string): ReadStream {
        return undefined;
    }

    public existsFile(path: string): boolean {
        return !this.unknownPaths.some(p => p === path);
    }

    public existsDir(path: string): boolean {
        return !this.unknownPaths.some(p => p === path);
    }

    public clearInvocations() {
        this.moveInvocations = [];
        this.copyInvocations = [];
    }

    public getMoveInvocations(): any[] {
        return this.moveInvocations;
    }

    public getCopyInvocations(): any[] {
        return this.copyInvocations;
    }

    public addUnknownPath(path: string): FileSystemWrapperMock {
        this.unknownPaths.push(path);
        return this;
    }
}