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
    collectionName: string,
    collectionNameValid: boolean,
}

export class DialogRenameCollection extends Component<DialogRenameCollectionProps, DialogRenameCollectionState> {

    constructor(props: DialogRenameCollectionProps) {
        super(props);
        this.state = {
            collectionName: this.props.collectionName,
            collectionNameValid: true,
        };
        this.actionRequestRename = this.actionRequestRename.bind(this);
        this.validateCollectionName = this.validateCollectionName.bind(this)
    }

    actionRequestRename(): void {
        const collectionName = this.state.collectionName.trim();
        if (this.validateCollectionName(collectionName)) {
            this.props.onRename(collectionName);
        } else {
            this.setState({
                collectionName: collectionName,
                collectionNameValid: false,
            });
        }
    }

    validateCollectionName(name: string): boolean {
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
                        value={this.state.collectionName}
                        onChange={(value) => this.setState({ collectionName: value })}
                    />
                </Box>
            </Dialog>
        );
    }

}