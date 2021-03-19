import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../components/modal/Dialog';
import { AlignCross, AlignMain, Dir, Size, Type, Variant } from '../../../components/common';
import { Box } from '../../../components/layout/Box';
import { InputField } from '../../../components/inputfield/InputField';


interface DialogCreateCollectionProps {
    onClose: () => void
    onCreate: (name: string) => void
}

interface DialogCreateCollectionState {
    name: string,
    nameValid: boolean,
}


export class DialogCreateCollection extends Component<DialogCreateCollectionProps, DialogCreateCollectionState> {

    constructor(props: DialogCreateCollectionProps) {
        super(props);
        this.state = {
            name: "",
            nameValid: true,
        };
        this.actionRequestCreate = this.actionRequestCreate.bind(this);
        this.validateName = this.validateName.bind(this)
    }

    actionRequestCreate(): void {
        const collectionName = this.state.name.trim();
        if (this.validateName(collectionName)) {
            this.props.onCreate(collectionName);
        } else {
            this.setState({
                name: collectionName,
                nameValid: false,
            });
        }
    }

    validateName(name: string): boolean {
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
                        value={this.state.name}
                        onChange={(value) => this.setState({ name: value })}
                    />
                </Box>
            </Dialog>
        );
    }

}