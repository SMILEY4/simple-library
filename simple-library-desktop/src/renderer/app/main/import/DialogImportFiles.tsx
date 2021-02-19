import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../components/modal/Dialog';
import { Type, Variant } from '../../../components/common';
import { ImportFilesForm } from './ImportFilesForm';

const electron = window.require('electron');

interface DialogImportFilesProps {
    show: boolean,
    onClose: () => void
    onImport: (data: ImportFilesData) => void
}

export interface ImportFilesData {
    selectionData: FileSelectionData
    copyOrMoveData: CopyOrMoveData,
    renameData: RenameData;
}


interface FileSelectionData {
    files: string[]
}

export enum FileAction {
    NONE = "none",
    MOVE = "move",
    COPY = "copy",
}

interface CopyOrMoveData {
    enabled: boolean,
    action: FileAction,
    targetDirectory: string | undefined
}

export const FILENAME_PART_TYPES: string[] = ["Nothing", "Filename", "Text", "Number From"];

interface FilenamePart {
    name: string,
    type: string,
    value: string | undefined
}

interface RenameData {
    enabled: boolean,
    parts: FilenamePart[]
}


export class DialogImportFiles extends Component<DialogImportFilesProps, ImportFilesData> {


    constructor(props: DialogImportFilesProps) {
        super(props);
        this.state = {
            selectionData: {
                files: [],
            },
            copyOrMoveData: {
                enabled: false,
                action: FileAction.NONE,
                targetDirectory: undefined,
            },
            renameData: {
                enabled: false,
                parts: [
                    {
                        name: "Front",
                        type: "Nothing",
                        value: undefined,
                    },
                    {
                        name: "Middle",
                        type: "Filename",
                        value: undefined,
                    },
                    {
                        name: "End",
                        type: "Nothing",
                        value: undefined,
                    },
                ],
            },
        };
        this.actionSelectFiles = this.actionSelectFiles.bind(this);
        this.actionToggleCopyOrMove = this.actionToggleCopyOrMove.bind(this);
        this.actionSelectCopyOrMoveAction = this.actionSelectCopyOrMoveAction.bind(this);
        this.actionSelectTargetDirectory = this.actionSelectTargetDirectory.bind(this);
        this.actionToggleRenameFiles = this.actionToggleRenameFiles.bind(this);
        this.actionSetFilenamePartType = this.actionSetFilenamePartType.bind(this);
        this.actionSetFilenamePartValue = this.actionSetFilenamePartValue.bind(this);
        this.validate = this.validate.bind(this);
        this.actionImportFiles = this.actionImportFiles.bind(this);
    }


    componentWillReceiveProps(newProps: DialogImportFilesProps) {
        if (newProps.show && newProps.show !== this.props.show) {
            this.setState({
                selectionData: {
                    files: [],
                },
                copyOrMoveData: {
                    enabled: false,
                    action: FileAction.NONE,
                    targetDirectory: undefined,
                },
                renameData: {
                    enabled: false,
                    parts: [
                        {
                            name: "Front",
                            type: "Nothing",
                            value: undefined,
                        },
                        {
                            name: "Middle",
                            type: "Filename",
                            value: undefined,
                        },
                        {
                            name: "End",
                            type: "Nothing",
                            value: undefined,
                        },
                    ],
                },
            });
        }
    }


    render(): ReactElement {
        return (
            <Dialog title={"Import Files"}
                    show={this.props.show}
                    closeButton={true}
                    onClose={this.props.onClose}
                    actions={[
                        {
                            content: "Cancel",
                            variant: Variant.OUTLINE,
                            onAction: this.props.onClose,
                        },
                        {
                            content: "Import",
                            variant: Variant.SOLID,
                            type: Type.PRIMARY,
                            onAction: this.actionImportFiles,
                        },
                    ]}>

                <ImportFilesForm
                    data={this.state}
                    onSelectFiles={this.actionSelectFiles}
                    onEnableCopyOrMove={this.actionToggleCopyOrMove}
                    onSelectCopyOrMoveAction={this.actionSelectCopyOrMoveAction}
                    onSelectTargetDirectory={this.actionSelectTargetDirectory}
                    onToggleRenameFiles={this.actionToggleRenameFiles}
                    onSetFilenamePartType={this.actionSetFilenamePartType}
                    onSetFilenamePartValue={this.actionSetFilenamePartValue}
                />

            </Dialog>
        );
    }


    actionSelectFiles(): void {
        electron.remote.dialog
            .showOpenDialog({
                title: 'Select Files',
                buttonLabel: 'Select',
                properties: [
                    'openFile',
                    'multiSelections',
                    'dontAddToRecent',
                ],
            })
            .then((result: any) => {
                if (!result.canceled) {
                    this.setState({ selectionData: { files: result.filePaths } });
                }
            });
    }

    actionToggleCopyOrMove(enable: boolean): void {
        this.setState({
            copyOrMoveData: {
                enabled: enable === true,
                action: this.state.copyOrMoveData.action,
                targetDirectory: this.state.copyOrMoveData.targetDirectory,
            },
        });
    }

    actionSelectCopyOrMoveAction(action: FileAction) {
        this.setState({
            copyOrMoveData: {
                enabled: this.state.copyOrMoveData.enabled,
                action: action,
                targetDirectory: this.state.copyOrMoveData.targetDirectory,
            },
        });
    }

    actionSelectTargetDirectory(): void {
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
                    this.setState({
                        copyOrMoveData: {
                            enabled: this.state.copyOrMoveData.enabled,
                            action: this.state.copyOrMoveData.action,
                            targetDirectory: result.filePaths[0],
                        },
                    });
                }
            });
    }

    actionToggleRenameFiles(enabled: boolean) {
        this.setState({
            renameData: {
                enabled: enabled,
                parts: this.state.renameData.parts,
            },
        });
    }

    actionSetFilenamePartType(partName: string, partType: string) {
        const nextRenameData = JSON.parse(JSON.stringify(this.state.renameData));
        const filenamePart = nextRenameData.parts.find((part: FilenamePart) => part.name === partName);
        filenamePart.type = partType;
        this.setState({
            renameData: nextRenameData,
        });
    }

    actionSetFilenamePartValue(partName: string, partValue: string) {
        const nextRenameData = JSON.parse(JSON.stringify(this.state.renameData));
        const filenamePart = nextRenameData.parts.find((part: FilenamePart) => part.name === partName);
        filenamePart.value = partValue;
        this.setState({
            renameData: nextRenameData,
        });
    }


    validate(): boolean {
        return true; // todo
    }


    actionImportFiles(): void {
        if (this.validate()) {
            this.props.onImport(this.state);
        }
    }

}