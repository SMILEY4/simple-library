import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../components/modal/Dialog';
import { AlignCross, AlignMain, Dir, Size, Type, Variant } from '../../../components/common';
import { Box } from '../../../components/layout/Box';
import { BodyText } from '../../../components/text/Text';
import { Checkbox } from '../../../components/checkbox/Checkbox';


interface DialogDeleteGroupProps {
    groupName: string | undefined,
    onClose: () => void,
    onDelete: (deleteChildren:boolean) => void,
}

interface DialogDeleteGroupState {
    deleteChildren: boolean
}

export class DialogDeleteGroup extends Component<DialogDeleteGroupProps, DialogDeleteGroupState> {

    constructor(props: DialogDeleteGroupProps) {
        super(props);
        this.state = {
            deleteChildren: true,
        };
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
                            onAction: () => this.props.onDelete(this.state.deleteChildren),
                        },
                    ]}>
                <Box dir={Dir.DOWN} alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>
                    <BodyText>
                        {'Are you sure you want to delete the group "' + this.props.groupName + '"?'}
                    </BodyText>
                    <Checkbox variant={Variant.OUTLINE}
                              selected={this.state.deleteChildren}
                              onToggle={(selected: boolean) => this.setState({ deleteChildren: selected })}>
                        {'Delete elements inside "' + this.props.groupName + '".'}
                    </Checkbox>
                </Box>
            </Dialog>
        );
    }

}