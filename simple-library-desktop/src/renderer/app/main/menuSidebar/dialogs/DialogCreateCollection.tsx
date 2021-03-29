import * as React from 'react';
import { Component, ReactElement } from 'react';
import { CollectionType, extractGroups, Group } from '../../../../../common/commonModels';
import { CreateCollectionMessage } from '../../../../../common/messaging/messagesCollections';
import { Dialog } from '../../../../components/modal/Dialog';
import { AlignCross, AlignMain, Size, Type, Variant } from '../../../../components/common';
import { HBox, VBox } from '../../../../components/layout/Box';
import { InputField } from '../../../../components/inputfield/InputField';
import { BodyText } from '../../../../components/text/Text';
import { ChoiceBox } from '../../../../components/choicebox/ChoiceBox';
import { TextArea } from '../../../../components/textarea/TextArea';
import { Separator, SeparatorDirection } from '../../../../components/separator/Separator';

const { ipcRenderer } = window.require('electron');


interface DialogCreateCollectionControllerProps {
    onClose: (successful: boolean) => void,
    triggerGroupId: number | undefined,
    rootGroup: Group,
}

interface DialogCreateCollectionControllerState {
    name: string,
    nameValid: boolean,
    type: CollectionType
    smartQuery: string
}

export class DialogCreateCollectionController extends Component<DialogCreateCollectionControllerProps, DialogCreateCollectionControllerState> {

    constructor(props: DialogCreateCollectionControllerProps) {
        super(props);
        this.state = {
            name: "",
            nameValid: true,
            type: CollectionType.NORMAL,
            smartQuery: "",
        };
        this.validate = this.validate.bind(this);
        this.typeToDisplayString = this.typeToDisplayString.bind(this);
        this.displayStringToType = this.displayStringToType.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    render(): ReactElement {
        return <DialogCreateCollection
            parentGroup={extractGroups(this.props.rootGroup).find(g => g.id === this.props.triggerGroupId)}
            name={this.state.name}
            onChangeName={(name: string) => this.setState({ name: name })}
            type={this.typeToDisplayString(this.state.type)}
            onSelectType={(type: string) => this.setState({ type: this.displayStringToType(type) })}
            smartQuery={this.state.smartQuery}
            onChangeSmartQuery={(query: string) => this.setState({ smartQuery: query })}
            onClose={this.handleCancel}
            onCreate={this.handleCreate}
        />;
    }

    typeToDisplayString(type: CollectionType): string {
        switch (type) {
            case CollectionType.NORMAL:
                return "Normal";
            case CollectionType.SMART:
                return "Smart";
        }
    }

    displayStringToType(type: string): CollectionType {
        switch (type) {
            case "Normal":
                return CollectionType.NORMAL;
            case "Smart":
                return CollectionType.SMART;
        }
    }

    validate(): boolean {
        const valid: boolean = this.state.name.trim().length > 0;
        // todo: validate query: fetch all items for query -> check if error is thrown
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
                type: this.state.type,
                smartQuery: this.state.type === CollectionType.SMART ? this.state.smartQuery : undefined,
                parentGroupId: this.props.triggerGroupId,
            }).finally(() => this.props.onClose(true));
        }
    }

}


interface DialogCreateCollectionProps {
    parentGroup: Group | undefined,
    name: string,
    onChangeName: (name: string) => void
    type: string,
    onSelectType: (type: string) => void,
    smartQuery: string,
    onChangeSmartQuery: (query: string) => void
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
            <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>

                <InputField
                    autoFocus
                    placeholder='Collection Name'
                    value={props.name}
                    onChange={props.onChangeName}
                />

                <Separator noBorder dir={SeparatorDirection.HORIZONTAL} spacing={Size.S_0_5} />

                <HBox spacing={Size.S_0_25} alignCross={AlignCross.CENTER}>
                    <BodyText>Collection Type:</BodyText>
                    <ChoiceBox variant={Variant.OUTLINE}
                               autoWidth={true}
                               items={["Normal", "Smart"]}
                               selected={props.type}
                               onSelect={props.onSelectType}
                    />
                </HBox>

                <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_25} padding={Size.S_1} withBorder>
                    <BodyText disabled={props.type !== "Smart"}>Smart-Collection Query:</BodyText>
                    <TextArea
                        value={props.smartQuery}
                        onChange={props.onChangeSmartQuery}
                        disabled={props.type !== "Smart"}
                        placeholder={"Leave empty to match all items."}
                        rows={5}
                        cols={40}
                    />
                </VBox>

                {props.parentGroup && (
                    <BodyText>{'Create in group "' + props.parentGroup.name + '".'} </BodyText>
                )}

            </VBox>
        </Dialog>
    );
}