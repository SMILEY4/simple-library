import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../components/modal/Dialog';
import { AlignCross, AlignMain, Dir, Size, Type, Variant } from '../../../components/common';
import { Box } from '../../../components/layout/Box';
import { BodyText } from '../../../components/text/Text';


interface DialogDeleteGroupProps {
    groupName: string | undefined,
    onClose: () => void,
    onDelete: () => void,
}


export class DialogDeleteGroup extends Component<DialogDeleteGroupProps> {

    constructor(props: DialogDeleteGroupProps) {
        super(props);
    }

    render(): ReactElement {
        return (
            <Dialog title={"Delete Group"}
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
                    <BodyText>{'Are you sure you want to delete the group "' + this.props.groupName + '"? This operation will delete any groups and collection in this group.'}</BodyText>
                </Box>
            </Dialog>
        );
    }

}