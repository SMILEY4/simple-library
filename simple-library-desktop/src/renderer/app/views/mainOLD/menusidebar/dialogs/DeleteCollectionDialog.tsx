import * as React from 'react';
import { Collection } from '../../../../../../common/commonModels';
import { Dialog } from '../../../../../components/_old/modal/Dialog';
import { AlignCross, AlignMain, Size, Type, Variant } from '../../../../../components/common/common';
import { VBox } from '../../../../../components/layout/box/Box';
import { BodyText } from '../../../../../components/base/text/Text';

interface DeleteCollectionDialogProps {
    collection: Collection,
    onCancel: () => void,
    onDelete: (collectionId: number) => void,
}

export function DeleteCollectionDialog(props: React.PropsWithChildren<DeleteCollectionDialogProps>): React.ReactElement {
    return (
        <Dialog title={"Delete Collection"}
                show={true}
                closeButton={true}
                onClose={props.onCancel}
                actions={[
                    {
                        content: "Cancel",
                        variant: Variant.OUTLINE,
                        onAction: props.onCancel,
                        triggeredByEscape: true,
                    },
                    {
                        content: "Delete",
                        variant: Variant.SOLID,
                        type: Type.ERROR,
                        onAction: () => props.onDelete(props.collection.id),
                        triggeredByEnter: true,
                    },
                ]}>
            <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>
                <BodyText>{'Are you sure you want to delete the collection "' + props.collection.name + '"? This operation will not delete any items.'}</BodyText>
            </VBox>
        </Dialog>
    );
}