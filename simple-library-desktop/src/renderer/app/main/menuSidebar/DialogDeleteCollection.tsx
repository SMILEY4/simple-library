import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../components/modal/Dialog';
import { AlignCross, AlignMain, Dir, Size, Type, Variant } from '../../../components/common';
import { Box } from '../../../components/layout/Box';
import { BodyText } from '../../../components/text/Text';


interface DialogDeleteCollectionProps {
    collectionName: string | undefined,
    onClose: () => void,
    onDelete: () => void,
}


export class DialogDeleteCollection extends Component<DialogDeleteCollectionProps> {

    constructor(props: DialogDeleteCollectionProps) {
        super(props);
    }

    render(): ReactElement {
        return (
            <Dialog title={"Delete"}
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
                            content: "Delete",
                            variant: Variant.SOLID,
                            type: Type.ERROR,
                            onAction: this.props.onDelete,
                        },
                    ]}>
                <Box dir={Dir.DOWN} alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>
                    <BodyText>{'Are you sure you want to delete the collection "' + this.props.collectionName + '"? This operation will not delete any items.'}</BodyText>
                </Box>
            </Dialog>
        );
    }

}