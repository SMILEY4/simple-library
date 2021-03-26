import * as React from 'react';
import { Component, ReactElement } from 'react';
import { extractGroups, Group } from '../../../../common/commonModels';
import { CreateCollectionMessage } from '../../../../common/messaging/messagesCollections';
import { Dialog } from '../../../components/modal/Dialog';
import { AlignCross, AlignMain, Dir, Size, Type, Variant } from '../../../components/common';
import { Box } from '../../../components/layout/Box';
import { InputField } from '../../../components/inputfield/InputField';
import { BodyText } from '../../../components/text/Text';

const { ipcRenderer } = window.require('electron');


interface DialogCreateCollectionControllerProps {
    show: boolean,
    onClose: (successful: boolean) => void,
    triggerGroupId: number | undefined,
    rootGroup: Group,
}

interface DialogCreateCollectionControllerState {
    name: string,
    nameValid: boolean
}

export class DialogCreateCollectionController extends Component<DialogCreateCollectionControllerProps, DialogCreateCollectionControllerState> {

    constructor(props: DialogCreateCollectionControllerProps) {
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
            return <DialogCreateCollection
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
            CreateCollectionMessage.request(ipcRenderer, {
                name: this.state.name.trim(),
                parentGroupId: this.props.triggerGroupId,
            }).finally(() => this.props.onClose(true));
        }
    }

}


interface DialogCreateCollectionProps {
    parentGroup: Group | undefined,
    name: string,
    onChangeName: (name: string) => void
    onClose: () => void
    onCreate: () => void
}

function DialogCreateCollection(props: React.PropsWithChildren<DialogCreateCollectionProps>): React.ReactElement {
    return (
        <Dialog title={"Create new Collection"}
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
                    placeholder='Collection Name'
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