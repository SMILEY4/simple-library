import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../components/modal/Dialog';
import { Type, Variant } from '../../../components/common';
import { ImportFilesForm } from './ImportFilesForm';
import { FileTargetAction, ImportProcessData, RenamePartType } from '../../../../common/commonModels';

const electron = window.require('electron');

interface DialogImportFilesProps {
    show: boolean,
    onClose: () => void
    onImport: (data: ImportProcessData) => void
}

export interface DialogImportFilesState {
    data: ImportProcessData
}


export class DialogImportFiles extends Component<DialogImportFilesProps, DialogImportFilesState> {


    constructor(props: DialogImportFilesProps) {
        super(props);
        this.state = {
            data: {
                files: [],
                fileTarget: {
                    action: FileTargetAction.KEEP,
                    targetDir: "",
                },
                renameInstructions: {
                    doRename: false,
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
                            type: RenamePartType.NOTHING,
                            value: "",
                        },
                    ],
                },
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
                data: {
                    files: [],
                    fileTarget: {
                        action: FileTargetAction.KEEP,
                        targetDir: "",
                    },
                    renameInstructions: {
                        doRename: false,
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
                                type: RenamePartType.NOTHING,
                                value: "",
                            },
                        ],
                    },
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
                    data={this.state.data}
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
                    const newState = Object.assign({}, this.state);
                    newState.data.files = result.filePaths;
                    this.setState(newState);
                }
            });
    }

    actionToggleCopyOrMove(enable: boolean): void {
        const newState = Object.assign({}, this.state);
        if (enable) {
            newState.data.fileTarget.action = FileTargetAction.MOVE;
        } else {
            newState.data.fileTarget.action = FileTargetAction.KEEP;
        }
        this.setState(newState);
    }

    actionSelectCopyOrMoveAction(action: FileTargetAction) {
        const newState = Object.assign({}, this.state);
        newState.data.fileTarget.action = action;
        this.setState(newState);
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
                    const newState = Object.assign({}, this.state);
                    newState.data.fileTarget.targetDir = result.filePaths[0];
                    this.setState(newState);
                }
            });
    }

    actionToggleRenameFiles(enabled: boolean) {
        const newState = Object.assign({}, this.state);
        newState.data.renameInstructions.doRename = enabled;
        this.setState(newState);
    }

    actionSetFilenamePartType(partIndex: number, partType: RenamePartType) {
        const newState = Object.assign({}, this.state);
        newState.data.renameInstructions.parts[partIndex].type = partType;
        this.setState(newState);
    }

    actionSetFilenamePartValue(partIndex: number, partValue: string) {
        const newState = Object.assign({}, this.state);
        newState.data.renameInstructions.parts[partIndex].value = partValue;
        this.setState(newState);
    }


    validate(): boolean {
        return true; // todo
    }


    actionImportFiles(): void {
        if (this.validate()) {
            this.props.onImport(this.state.data);
        }
    }

}