import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../../components/modal/Dialog';
import { AlignCross, AlignMain, Dir, Size, Type, Variant } from '../../../../components/common';
import { Box } from '../../../../components/layout/Box';
import { BodyText } from '../../../../components/text/Text';
import { Collection } from '../../../../../common/commonModels';
import { DeleteCollectionMessage } from '../../../../../common/messaging/messagesCollections';

const { ipcRenderer } = window.require('electron');


interface DialogDeleteCollectionControllerProps {
    collection: Collection,
    onClose: (successful: boolean) => void,
}

interface DialogDeleteCollectionControllerState {
}

export class DialogDeleteCollectionController extends Component<DialogDeleteCollectionControllerProps, DialogDeleteCollectionControllerState> {

    constructor(props: DialogDeleteCollectionControllerProps) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    render(): ReactElement {
        return <DialogDeleteCollection
            collectionName={this.props.collection.name}
            onClose={this.handleCancel}
            onDelete={this.handleDelete}
        />;
    }

    handleCancel() {
        this.props.onClose(false);
    }

    handleDelete() {
        DeleteCollectionMessage.request(ipcRenderer, { collectionId: this.props.collection.id })
            .finally(() => this.props.onClose(true));
    }

}


interface DialogDeleteCollectionProps {
    collectionName: string | undefined,
    onClose: () => void,
    onDelete: () => void,
}


function DialogDeleteCollection(props: React.PropsWithChildren<DialogDeleteCollectionProps>): React.ReactElement {
    return (
        <Dialog title={"Delete Collection"}
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
                        content: "Delete",
                        variant: Variant.SOLID,
                        type: Type.ERROR,
                        onAction: props.onDelete,
                        triggeredByEnter: true,
                    },
                ]}>
            <Box dir={Dir.DOWN} alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>
                <BodyText>{'Are you sure you want to delete the collection "' + props.collectionName + '"? This operation will not delete any items.'}</BodyText>
            </Box>
        </Dialog>
    );
}

