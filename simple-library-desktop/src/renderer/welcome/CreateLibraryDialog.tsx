import * as React from "react";
import {Component, ReactElement} from "react";
import {Dialog} from "_renderer/components/modal/Dialog";
import {ButtonFilled} from "_renderer/components/buttons/Buttons";
import {AlignmentCross, AlignmentMain, Direction, HighlightType} from "_renderer/components/Common";
import {InputFieldGhostBg1} from "_renderer/components/inputfield/InputField";
import {GoFileDirectory} from "react-icons/all";
import {Container, ContainerCenterAlign} from "_renderer/components/layout/Container";
import {Box} from "_renderer/components/layout/Box";

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
            libraryName: "",
            libraryNameValid: true,
            targetDir: "",
            targetDirValid: true
        }
        this.actionBrowseTargetDir = this.actionBrowseTargetDir.bind(this)
        this.actionRequestCreateLibrary = this.actionRequestCreateLibrary.bind(this)
    }

    componentWillReceiveProps(newProps: CreateLibraryDialogProps) {
        if (newProps.show && newProps.show !== this.props.show) {
            this.setState({
                libraryName: "",
                libraryNameValid: true,
                targetDir: "",
                targetDirValid: true
            })
        }
    }

    actionBrowseTargetDir(): void {
        electron.remote.dialog
            .showOpenDialog({
                title: "Select target directory",
                buttonLabel: "Select",
                properties: [
                    "openDirectory",
                    "createDirectory"
                ]
            })
            .then((result) => {
                if (!result.canceled) {
                    this.setState({targetDir: result.filePaths[0]})
                }
            });
    }


    actionRequestCreateLibrary(): void {
        const libraryNameValid: boolean = this.validateLibraryName(this.state.libraryName)
        const targetDirValid: boolean = this.validateTargetDirectory(this.state.targetDir)
        if (libraryNameValid && targetDirValid) {
            this.props.onCreate(this.state.libraryName, this.state.targetDir)
        } else {
            this.setState({
                libraryNameValid: libraryNameValid,
                targetDirValid: targetDirValid
            })
        }
    }


    validateLibraryName(name: string): boolean {
        return name.length > 0
    }


    validateTargetDirectory(targetDir: string): boolean {
        return targetDir.length > 0
    }


    render(): ReactElement {
        return (
            <Dialog show={this.props.show}
                    modalRootId="root"
                    title={"Create New Library"}
                    withCloseButton={true}
                    onClose={this.props.onClose}
                    footerActions={
                        <>
                            <ButtonFilled onClick={this.props.onClose}>Cancel</ButtonFilled>
                            <ButtonFilled onClick={this.actionRequestCreateLibrary} highlight={HighlightType.INFO}>Create</ButtonFilled>
                        </>
                    }
            >
                <Container dir={Direction.DOWN} alignMain={AlignmentMain.CENTER} alignCross={AlignmentCross.STRETCH} spacing="1em">
                    <InputFieldGhostBg1
                        type={HighlightType.DEFAULT}
                        invalid={!this.state.libraryNameValid}
                        placeholder={"Library Name"}
                        onAccept={(value) => this.setState({libraryName: value})}
                    />
                    <InputFieldGhostBg1
                        text={this.state.targetDir}
                        type={HighlightType.DEFAULT}
                        invalid={!this.state.targetDirValid}
                        placeholder={"Select Directory"}
                        editable={false}
                        contentLeading={
                            <Box expandFully expandChildrenFully>
                                <ContainerCenterAlign>
                                    <GoFileDirectory/>
                                </ContainerCenterAlign>
                            </Box>
                        }
                        contentTrailing={
                            <ButtonFilled onClick={this.actionBrowseTargetDir}>
                                Browse
                            </ButtonFilled>
                        }
                    />
                </Container>
            </Dialog>
        )
    }
}