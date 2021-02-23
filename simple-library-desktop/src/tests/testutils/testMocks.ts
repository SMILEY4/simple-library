import { FileSystemWrapper } from '../../main/service/utils/fileSystemWrapper';
import { startAsyncWithValue } from '../../common/AsyncCommon';

export class FileSystemWrapperMock extends FileSystemWrapper {

    moveInvocations: any[] = [];
    copyInvocations: any[] = [];

    public async move(source: string, target: string): Promise<string> {
        this.moveInvocations.push({ source: source, target: target });
        return startAsyncWithValue(target);
    }

    public copy(source: string, target: string, allowOverwrite: boolean): Promise<string> {
        this.copyInvocations.push({ source: source, target: target });
        return startAsyncWithValue(target);
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
}