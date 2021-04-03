import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../../../../components/modal/Dialog';
import { Type, Variant } from '../../../../../../components/common';
import { ImportFilesForm } from './ImportFilesForm';
import { ImportProcessData, ImportTargetAction, RenamePartType } from '../../../../../../../common/commonModels';

const electron = window.require('electron');

interface DialogImportFilesProps {
    onClose: () => void
    onImport: (data: ImportProcessData) => void
}

export interface ImportValidationData {
    selectedFilesInvalid: boolean,
    targetDirInvalid: boolean,
    invalidRenamePartValues: number[],
    renameDataInvalid: boolean,
}

export interface DialogImportFilesState {
    data: ImportProcessData,
    validationData: ImportValidationData
}


export class DialogImportFiles extends Component<DialogImportFilesProps, DialogImportFilesState> {


    constructor(props: DialogImportFilesProps) {
        super(props);
        this.state = {
            data: {
                files: [],
                importTarget: {
                    action: ImportTargetAction.KEEP,
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
            validationData: {
                selectedFilesInvalid: false,
                targetDirInvalid: false,
                invalidRenamePartValues: [],
                renameDataInvalid: false,
            },
        };
        this.actionSelectFiles = this.actionSelectFiles.bind(this);
        this.actionSelectImportTargetAction = this.actionSelectImportTargetAction.bind(this);
        this.actionSelectTargetDirectory = this.actionSelectTargetDirectory.bind(this);
        this.actionToggleRenameFiles = this.actionToggleRenameFiles.bind(this);
        this.actionSetFilenamePartType = this.actionSetFilenamePartType.bind(this);
        this.actionSetFilenamePartValue = this.actionSetFilenamePartValue.bind(this);
        this.validate = this.validate.bind(this);
        this.actionImportFiles = this.actionImportFiles.bind(this);
    }

    render(): ReactElement {
        return (
            <Dialog title={"Import Files"}
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
                            content: "Import",
                            variant: Variant.SOLID,
                            type: Type.PRIMARY,
                            onAction: this.actionImportFiles,
                        },
                    ]}>

                <ImportFilesForm
                    data={this.state.data}
                    validationData={this.state.validationData}
                    onSelectFiles={this.actionSelectFiles}
                    onSelectImportTargetAction={this.actionSelectImportTargetAction}
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

    actionSelectImportTargetAction(action: ImportTargetAction) {
        const newState = Object.assign({}, this.state);
        newState.data.importTarget.action = action;
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
                    newState.data.importTarget.targetDir = result.filePaths[0];
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
        let dataValid: boolean = true;
        const importProcessData: ImportProcessData = this.state.data;

        const validationData: ImportValidationData = {
            selectedFilesInvalid: false,
            targetDirInvalid: false,
            invalidRenamePartValues: [],
            renameDataInvalid: false,
        };

        if (!importProcessData.files || importProcessData.files.length == 0) {
            dataValid = false;
            validationData.selectedFilesInvalid = true;
        }

        if (importProcessData.importTarget.action !== ImportTargetAction.KEEP) {
            if (!importProcessData.importTarget.targetDir || importProcessData.importTarget.targetDir.length == 0) {
                dataValid = false;
                validationData.targetDirInvalid = true;
            }
        }

        if (importProcessData.renameInstructions.parts.map(part => part.type).every(type => type === RenamePartType.NOTHING)) {
            dataValid = false;
            validationData.renameDataInvalid = true;
        }
        for (let i = 0; i < importProcessData.renameInstructions.parts.length; i++) {
            const part = importProcessData.renameInstructions.parts[i];
            if (part.type === RenamePartType.TEXT) {
                if (!part.value || part.value.trim().length == 0) {
                    validationData.invalidRenamePartValues.push(i);
                    dataValid = false;
                }
            }
            if (part.type === RenamePartType.NUMBER_FROM) {
                if (!part.value || part.value.trim().length == 0 || isNaN(parseInt(part.value, 10))) {
                    validationData.invalidRenamePartValues.push(i);
                    dataValid = false;
                }
            }
        }

        this.setState({
            data: this.state.data,
            validationData: validationData,
        });

        return dataValid;
    }


    actionImportFiles(): void {
        if (this.validate()) {
            this.props.onImport(this.state.data);
        }
    }

}