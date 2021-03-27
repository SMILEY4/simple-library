import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../../components/modal/Dialog';
import { AlignCross, AlignMain, Dir, Size, Type, Variant } from '../../../../components/common';
import { Box } from '../../../../components/layout/Box';
import { InputField } from '../../../../components/inputfield/InputField';
import { Collection } from '../../../../../common/commonModels';
import { RenameCollectionMessage } from '../../../../../common/messaging/messagesCollections';

const { ipcRenderer } = window.require('electron');


interface DialogRenameCollectionControllerProps {
    collection: Collection,
    onClose: (successful: boolean) => void,

}

interface DialogRenameCollectionControllerState {
    name: string,
    nameValid: boolean,
}

export class DialogRenameCollectionController extends Component<DialogRenameCollectionControllerProps, DialogRenameCollectionControllerState> {

    constructor(props: DialogRenameCollectionControllerProps) {
        super(props);
        this.state = {
            name: "",
            nameValid: true,
        };
        this.validate = this.validate.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleRename = this.handleRename.bind(this);
    }

    render(): ReactElement {
        return <DialogRenameCollection
            name={this.state.name}
            onChangeName={(name: string) => this.setState({ name: name })}
            onClose={this.handleCancel}
            onRename={this.handleRename}
        />;
    }

    validate(): boolean {
        const valid: boolean = this.state.name.trim().length > 0;
        if (!valid) {
            this.setState({
                name: this.state.name.trim(),
                nameValid: false,
            });
        }
        return valid;
    }

    handleCancel() {
        this.props.onClose(false);
    }

    handleRename() {
        if (this.validate()) {
            RenameCollectionMessage.request(ipcRenderer, {
                collectionId: this.props.collection.id,
                newName: this.state.name.trim(),
            }).finally(() => this.props.onClose(true));
        }
    }


}


interface DialogRenameCollectionProps {
    name: string,
    onChangeName: (name: string) => void
    onClose: () => void
    onRename: () => void
}

function DialogRenameCollection(props: React.PropsWithChildren<DialogRenameCollectionProps>): React.ReactElement {
    return (
        <Dialog title={"Rename Collection"}
                show={true}
                closeButton={true}
                onClose={props.onClose}
                actions={[
                    {
                        content: "Cancel",
                        variant: Variant.OUTLINE,
                        onAction: props.onClose,
                        triggeredByEscape: true,
                    },
                    {
                        content: "Rename",
                        variant: Variant.SOLID,
                        type: Type.PRIMARY,
                        onAction: props.onRename,
                        triggeredByEnter: true,
                    },
                ]}>
            <Box dir={Dir.DOWN} alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>
                <InputField
                    autoFocus
                    placeholder='Collection Name'
                    value={props.name}
                    onChange={props.onChangeName}
                />
            </Box>
        </Dialog>
    );
}