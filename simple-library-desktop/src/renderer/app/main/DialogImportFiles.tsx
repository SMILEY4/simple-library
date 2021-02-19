import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../components/modal/Dialog';
import { AlignCross, AlignMain, Fill, GroupPosition, Size, Type, Variant } from '../../components/common';
import { HBox, VBox } from '../../components/layout/Box';
import { InputField } from '../../components/inputfield/InputField';
import { AiFillFile, GoFileDirectory } from 'react-icons/all';
import { Button } from '../../components/button/Button';
import { BodyText } from '../../components/text/Text';
import { Checkbox } from '../../components/checkbox/Checkbox';
import { Separator, SeparatorDirection } from '../../components/separator/Separator';
import { Grid } from '../../components/layout/Grid';
import { ChoiceBox } from '../../components/choicebox/ChoiceBox';

const electron = window.require('electron');

interface DialogImportFilesProps {
    show: boolean,
    onClose: () => void
    onImport: (name: string, targetDir: string) => void
}


interface FileSelectionData {
    files: string[]
}

interface CopyOrMoveData {
    enabled: boolean,
    copy: boolean,
    move: boolean,
    targetDirectory: string | undefined
}

interface RenameData {
    rename: boolean
}

interface DialogImportFilesState {
    selectionData: FileSelectionData
    copyOrMoveData: CopyOrMoveData,
    renameData: RenameData;
}


export class DialogImportFiles extends Component<DialogImportFilesProps, DialogImportFilesState> {


    constructor(props: DialogImportFilesProps) {
        super(props);
        this.state = {
            selectionData: {
                files: [],
            },
            copyOrMoveData: {
                enabled: false,
                move: true,
                copy: false,
                targetDirectory: undefined,
            },
            renameData: {
                rename: false,
            },
        };
        this.actionSelectFiles = this.actionSelectFiles.bind(this);
        this.actionImportFiles = this.actionImportFiles.bind(this);
        this.actionToggleCopyOrMove = this.actionToggleCopyOrMove.bind(this);
        this.filesToDisplayString = this.filesToDisplayString.bind(this);
        this.getRenamePartTypes = this.getRenamePartTypes.bind(this);
    }

    componentWillReceiveProps(newProps: DialogImportFilesProps) {
        if (newProps.show && newProps.show !== this.props.show) {
            this.setState({
                selectionData: {
                    files: [],
                },
                copyOrMoveData: {
                    enabled: false,
                    copy: false,
                    move: false,
                    targetDirectory: undefined,
                },
                renameData: {
                    rename: false,
                },
            });
        }
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
                copy: this.state.copyOrMoveData.copy,
                move: this.state.copyOrMoveData.move,
                targetDirectory: this.state.copyOrMoveData.targetDirectory,
            },
        });
    }

    actionImportFiles(): void {
    }


    filesToDisplayString(files: string[]): string | undefined {
        if (files.length === 0) {
            return undefined;
        } else if (files.length === 1) {
            return files[0];
        } else {
            return files.length + " files selected.";
        }
    }

    getRenamePartTypes(): string[] {
        return [
            "Nothing", // nothing
            "Text", // any text
            "Filename", // original filename
            "Number From", // count from given number up (only for selected files)
        ]
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
                <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>

                    <BodyText>Select files to import</BodyText>
                    <InputField
                        placeholder='Files to import'
                        locked={true}
                        icon={<AiFillFile />}
                        contentTrailing={
                            <Button variant={Variant.SOLID} groupPos={GroupPosition.END} onAction={this.actionSelectFiles}>Select</Button>}
                        value={this.filesToDisplayString(this.state.selectionData.files)}
                    />

                    <Separator noBorder dir={SeparatorDirection.HORIZONTAL} spacing={Size.S_0_5} />

                    <Checkbox variant={Variant.OUTLINE} selected={this.state.copyOrMoveData.enabled} onToggle={this.actionToggleCopyOrMove}>
                        Copy or move files
                    </Checkbox>
                    <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75} padding={Size.S_1} withBorder>
                        <Checkbox variant={Variant.OUTLINE} selected={this.state.copyOrMoveData.move} disabled={!this.state.copyOrMoveData.enabled}>
                            Move files
                        </Checkbox>
                        <Checkbox variant={Variant.OUTLINE} selected={this.state.copyOrMoveData.copy} disabled={!this.state.copyOrMoveData.enabled}>
                            Copy files
                        </Checkbox>
                        <InputField
                            placeholder='Target Directory'
                            locked={true}
                            disabled={!this.state.copyOrMoveData.enabled}
                            icon={<GoFileDirectory />}
                            contentTrailing={
                                <Button variant={Variant.SOLID} groupPos={GroupPosition.END} onAction={this.actionSelectFiles} disabled={!this.state.copyOrMoveData.enabled}>Browse</Button>}
                            value={this.state.copyOrMoveData.targetDirectory}
                        />
                    </VBox>


                    <Separator noBorder dir={SeparatorDirection.HORIZONTAL} spacing={Size.S_0_5} />

                    <Checkbox variant={Variant.OUTLINE}
                              selected={this.state.renameData.rename}
                              onToggle={(selected: boolean) => this.setState({ renameData: { rename: selected } })}>
                        Rename files
                    </Checkbox>
                    <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75} padding={Size.S_1} withBorder>
                        <Grid columns={['1fr', '1fr', '1fr']} rows={['1fr']} fill={Fill.TRUE} gap={Size.S_0_5}>
                            <VBox spacing={Size.S_0_25}>
                                <BodyText>Front</BodyText>
                                <ChoiceBox variant={Variant.OUTLINE} selected={"nothing"} items={this.getRenamePartTypes()} maxVisibleItems={5} autoWidth onTopSide/>
                                <InputField value={""} />
                            </VBox>
                            <VBox spacing={Size.S_0_25}>
                                <BodyText>Middle</BodyText>
                                <ChoiceBox variant={Variant.OUTLINE} selected={"nothing"} items={this.getRenamePartTypes()} maxVisibleItems={5} autoWidth onTopSide/>
                                <InputField value={""} />
                            </VBox>
                            <VBox spacing={Size.S_0_25}>
                                <BodyText>End</BodyText>
                                <ChoiceBox variant={Variant.OUTLINE} selected={"nothing"} items={this.getRenamePartTypes()} maxVisibleItems={5} autoWidth onTopSide/>
                                <InputField value={""} />
                            </VBox>
                        </Grid>
                        <HBox spacing={Size.S_0_15}>
                            <BodyText>Example: </BodyText>
                            <BodyText italic>1803d0001.jpg</BodyText>
                        </HBox>
                    </VBox>

                </VBox>
            </Dialog>
        );
    }

}