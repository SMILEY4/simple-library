import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../components/modal/Dialog';
import { ButtonFilled } from '../../components/buttons/Buttons';
import { AlignCross, AlignMain, Dir, Fill, HighlightType, Size } from '../../components/common';
import { InputFieldGhostBg1 } from '../../components/inputfield/InputField';
import { GoFileDirectory } from 'react-icons/all';
import { Box, CBox } from '../../components/layout/Box';

const electron = window.require('electron');

interface CreateLibraryDialogProps {
    show: boolean,
    onClose: () => void
    onCreate: (name: string, targetDir: string) => void
}

interface CreateLibraryDialogState {
    libraryName: string,
    libraryNameValid: boolean,
    targetDir: string
    targetDirValid: boolean,
}


export class CreateLibraryDialog extends Component<CreateLibraryDialogProps, CreateLibraryDialogState> {


    constructor(props: CreateLibraryDialogProps) {
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

    componentWillReceiveProps(newProps: CreateLibraryDialogProps) {
        if (newProps.show && newProps.show !== this.props.show) {
            this.setState({
                libraryName: '',
                libraryNameValid: true,
                targetDir: '',
                targetDirValid: true,
            });
        }
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
            <Dialog show={this.props.show}
                    modalRootId='root'
                    title={'Create New Library'}
                    withCloseButton={true}
                    onClose={this.props.onClose}
                    footerActions={
                        <>
                            <ButtonFilled onClick={this.props.onClose}>Cancel</ButtonFilled>
                            <ButtonFilled onClick={this.actionRequestCreateLibrary} highlight={HighlightType.INFO}>Create</ButtonFilled>
                        </>
                    }
            >
                <Box dir={Dir.DOWN} alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>
                    <InputFieldGhostBg1
                        type={HighlightType.DEFAULT}
                        invalid={!this.state.libraryNameValid}
                        placeholder={'Library Name'}
                        onAccept={(value) => this.setState({ libraryName: value })}
                    />
                    <InputFieldGhostBg1
                        text={this.state.targetDir}
                        type={HighlightType.DEFAULT}
                        invalid={!this.state.targetDirValid}
                        placeholder={'Select Directory'}
                        editable={false}
                        contentLeading={
                            <Box fill={Fill.TRUE}>
                                <CBox dir={Dir.DOWN}>
                                    <GoFileDirectory />
                                </CBox>
                            </Box>
                        }
                        contentTrailing={
                            <ButtonFilled onClick={this.actionBrowseTargetDir}>
                                Browse
                            </ButtonFilled>
                        }
                    />
                </Box>
            </Dialog>
        );
    }
}