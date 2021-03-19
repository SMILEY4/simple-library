import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../components/modal/Dialog';
import { AlignCross, AlignMain, Dir, Size, Type, Variant } from '../../../components/common';
import { Box } from '../../../components/layout/Box';
import { BodyText } from '../../../components/text/Text';
import { InputField } from '../../../components/inputfield/InputField';


interface DialogRenameCollectionProps {
    collectionName: string | undefined,
    onClose: () => void,
    onRename: (newCollectionName:string) => void,
}

interface DialogRenameCollectionState {
    name: string,
    nameValid: boolean,
}

export class DialogRenameCollection extends Component<DialogRenameCollectionProps, DialogRenameCollectionState> {

    constructor(props: DialogRenameCollectionProps) {
        super(props);
        this.state = {
            name: this.props.collectionName,
            nameValid: true,
        };
        this.actionRequestRename = this.actionRequestRename.bind(this);
        this.validateName = this.validateName.bind(this)
    }

    actionRequestRename(): void {
        const name = this.state.name.trim();
        if (this.validateName(name)) {
            this.props.onRename(name);
        } else {
            this.setState({
                name: name,
                nameValid: false,
            });
        }
    }

    validateName(name: string): boolean {
        return name.length > 0;
    }

    render(): ReactElement {
        return (
            <Dialog title={"Rename Collection"}
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
                            content: "Rename",
                            variant: Variant.SOLID,
                            type: Type.PRIMARY,
                            onAction: this.actionRequestRename
                        },
                    ]}>
                <Box dir={Dir.DOWN} alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>
                    <InputField
                        autoFocus
                        placeholder='Collection Name'
                        value={this.state.name}
                        onChange={(value) => this.setState({ name: value })}
                    />
                </Box>
            </Dialog>
        );
    }

}