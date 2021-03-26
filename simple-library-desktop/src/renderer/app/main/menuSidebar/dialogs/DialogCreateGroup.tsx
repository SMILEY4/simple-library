import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../../components/modal/Dialog';
import { AlignCross, AlignMain, Dir, Size, Type, Variant } from '../../../../components/common';
import { Box } from '../../../../components/layout/Box';
import { InputField } from '../../../../components/inputfield/InputField';
import { extractGroups, Group } from '../../../../../common/commonModels';
import { BodyText } from '../../../../components/text/Text';
import { CreateGroupMessage } from '../../../../../common/messaging/messagesGroups';

const { ipcRenderer } = window.require('electron');


interface DialogCreateGroupControllerProps {
    show: boolean,
    onClose: (successful: boolean) => void,
    triggerGroupId: number | undefined,
    rootGroup: Group,
}

interface DialogCreateGroupControllerState {
    name: string,
    nameValid: boolean
}


export class DialogCreateGroupController extends Component<DialogCreateGroupControllerProps, DialogCreateGroupControllerState> {

    constructor(props: DialogCreateGroupControllerProps) {
        super(props);
        this.state = {
            name: "",
            nameValid: true,
        };
        this.validate = this.validate.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    render(): ReactElement {
        if (this.props.show) {
            return <DialogCreateGroup
                parentGroup={extractGroups(this.props.rootGroup).find(g => g.id === this.props.triggerGroupId)}
                name={this.state.name}
                onChangeName={(name: string) => this.setState({ name: name })}
                onClose={this.handleCancel}
                onCreate={this.handleCreate}
            />;
        } else {
            return null;
        }
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

    handleCreate() {
        if (this.validate()) {
            CreateGroupMessage.request(ipcRenderer, {
                name: this.state.name.trim(),
                parentGroupId: this.props.triggerGroupId,
            }).finally(() => this.props.onClose(true));
        }
    }

}


interface DialogCreateGroupProps {
    parentGroup: Group | undefined,
    name: string,
    onChangeName: (name: string) => void
    onClose: () => void
    onCreate: () => void
}

function DialogCreateGroup(props: React.PropsWithChildren<DialogCreateGroupProps>): React.ReactElement {
    return (
        <Dialog title={"Create new Group"}
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
                        content: "Create",
                        variant: Variant.SOLID,
                        type: Type.PRIMARY,
                        onAction: props.onCreate,
                        triggeredByEnter: true,
                    },
                ]}>
            <Box dir={Dir.DOWN} alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>
                <InputField
                    autoFocus
                    placeholder='Group Name'
                    value={props.name}
                    onChange={props.onChangeName}
                />
                {props.parentGroup && (
                    <BodyText>{'Create in group "' + props.parentGroup.name + '".'} </BodyText>
                )}
            </Box>
        </Dialog>
    );
}
