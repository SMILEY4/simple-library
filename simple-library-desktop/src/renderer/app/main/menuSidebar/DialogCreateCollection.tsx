import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../components/modal/Dialog';
import { AlignCross, AlignMain, Dir, Size, Type, Variant } from '../../../components/common';
import { Box } from '../../../components/layout/Box';
import { InputField } from '../../../components/inputfield/InputField';
import { Collection } from '../../../../common/commonModels';


interface DialogCreateCollectionProps {
    onClose: () => void
    onCreate: (name: string) => void
}

interface DialogCreateCollectionState {
    collectionName: string,
    collectionNameValid: boolean,
}


export class DialogCreateCollection extends Component<DialogCreateCollectionProps, DialogCreateCollectionState> {

    constructor(props: DialogCreateCollectionProps) {
        super(props);
        this.state = {
            collectionName: "",
            collectionNameValid: true,
        };
        this.actionRequestCreate = this.actionRequestCreate.bind(this);
    }

    actionRequestCreate(): void {
        const collectionName = this.state.collectionName.trim();
        if (this.validateCollectionName(collectionName)) {
            this.props.onCreate(collectionName);
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
            <Dialog title={"Create new Collection"}
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
                            onAction: this.actionRequestCreate,
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