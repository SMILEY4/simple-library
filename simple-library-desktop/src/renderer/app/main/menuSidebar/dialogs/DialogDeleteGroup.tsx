import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../../components/modal/Dialog';
import { AlignCross, AlignMain, Dir, Size, Type, Variant } from '../../../../components/common';
import { Box } from '../../../../components/layout/Box';
import { BodyText } from '../../../../components/text/Text';
import { Checkbox } from '../../../../components/checkbox/Checkbox';
import { Group } from '../../../../../common/commonModels';
import { DeleteGroupMessage } from '../../../../../common/messaging/messagesGroups';

const { ipcRenderer } = window.require('electron');


interface DialogDeleteGroupControllerProps {
    show: boolean,
    group: Group,
    onClose: (successful: boolean) => void,

}

interface DialogDeleteGroupControllerState {
    deleteChildren: boolean
}

export class DialogDeleteGroupController extends Component<DialogDeleteGroupControllerProps, DialogDeleteGroupControllerState> {

    constructor(props: DialogDeleteGroupControllerProps) {
        super(props);
        this.state = {
            deleteChildren: true,
        };
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    render(): ReactElement {
        if (this.props.show) {
            return <DialogDeleteGroup
                groupName={this.props.group.name}
                deleteChildren={this.state.deleteChildren}
                onToggleDeleteChildren={(deleteChildren: boolean) => this.setState({ deleteChildren: deleteChildren })}
                onClose={this.handleCancel}
                onDelete={this.handleDelete}
            />;
        } else {
            return null;
        }
    }


    handleCancel() {
        this.props.onClose(false);
    }

    handleDelete() {
        DeleteGroupMessage.request(ipcRenderer, {
            groupId: this.props.group.id,
            deleteChildren: this.state.deleteChildren,
        }).finally(() => this.props.onClose(true));
    }

}


interface DialogDeleteGroupProps {
    groupName: string,
    deleteChildren: boolean,
    onToggleDeleteChildren: (deleteChildren: boolean) => void,
    onClose: () => void,
    onDelete: () => void,
}

function DialogDeleteGroup(props: React.PropsWithChildren<DialogDeleteGroupProps>): React.ReactElement {
    return (
        <Dialog title={"Delete Group"}
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
                <BodyText>
                    {'Are you sure you want to delete the group "' + props.groupName + '"?'}
                </BodyText>
                <Checkbox variant={Variant.OUTLINE}
                          selected={props.deleteChildren}
                          onToggle={props.onToggleDeleteChildren}>
                    {'Delete elements inside "' + props.groupName + '".'}
                </Checkbox>
            </Box>
        </Dialog>
    );
}
