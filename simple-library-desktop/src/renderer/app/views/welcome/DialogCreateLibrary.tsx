import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../components/modal/Dialog';
import { AlignCross, AlignMain, GroupPosition, Size, Type, Variant } from '../../../components/common';
import { VBox } from '../../../components/layout/Box';
import { InputField } from '../../../components/inputfield/InputField';
import { GoFileDirectory } from 'react-icons/all';
import { Button } from '../../../components/button/Button';

const electron = window.require('electron');

interface DialogCreateLibraryProps {
    onClose: () => void
    onCreate: (name: string, targetDir: string) => void
}

interface DialogCreateLibraryState {
    libraryName: string,
    libraryNameValid: boolean,
    targetDir: string
    targetDirValid: boolean,
}


export class DialogCreateLibrary extends Component<DialogCreateLibraryProps, DialogCreateLibraryState> {


    constructor(props: DialogCreateLibraryProps) {
        super(props);
        this.state = {
            libraryName: '',
            libraryNameValid: true,
            targetDir: '',
            targetDirValid: true,
        };
        this.actionBrowseTargetDir = this.actionBrowseTargetDir.bind(this);
        this.actionRequestCreateLibrary = this.actionRequestCreateLibrary.bind(this);
    }

    actionBrowseTargetDir(): void {
        electron.remote.dialog
            .showOpenDialog({
                title: 'Select target directory',
                buttonLabel: 'Select',
                properties: [
                    'openDirectory',
                    'createDirectory',
                ],
            })
            .then((result: any) => {
                if (!result.canceled) {
                    this.setState({ targetDir: result.filePaths[0] });
                }
            });
    }


    actionRequestCreateLibrary(): void {
        const libraryNameValid: boolean = this.validateLibraryName(this.state.libraryName);
        const targetDirValid: boolean = this.validateTargetDirectory(this.state.targetDir);
        if (libraryNameValid && targetDirValid) {
            this.props.onCreate(this.state.libraryName, this.state.targetDir);
        } else {
            this.setState({
                libraryNameValid: libraryNameValid,
                targetDirValid: targetDirValid,
            });
        }
    }


    validateLibraryName(name: string): boolean {
        return name.length > 0;
    }


    validateTargetDirectory(targetDir: string): boolean {
        return targetDir.length > 0;
    }


    render(): ReactElement {
        return (
            <Dialog title={"Create new Library"}
                    show={true}
                    closeButton={true}
                    onClose={this.props.onClose}
                    actions={[
                        {
                            content: "Cancel",
                            variant: Variant.OUTLINE,
                            onAction: this.props.onClose,
                        },
                        {
                            content: "Create",
                            variant: Variant.SOLID,
                            type: Type.PRIMARY,
                            onAction: this.actionRequestCreateLibrary,
                        },
                    ]}>
                <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>
                    <InputField
                        autoFocus
                        placeholder='Library Name'
                        value={this.state.libraryName}
                        onChange={(value) => this.setState({ libraryName: value })}
                    />
                    <InputField
                        placeholder='Library Directory'
                        locked={true}
                        icon={<GoFileDirectory />}
                        contentTrailing={
                            <Button variant={Variant.SOLID} groupPos={GroupPosition.END} onAction={this.actionBrowseTargetDir}>Browse</Button>}
                        value={this.state.targetDir}
                    />
                </VBox>
            </Dialog>
        );
    }

}