import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog } from '../../../../components/modal/Dialog';
import { AlignCross, AlignMain, Size, Type, Variant } from '../../../../components/common';
import { HBox, VBox } from '../../../../components/layout/Box';
import { InputField } from '../../../../components/inputfield/InputField';
import { Collection, CollectionType } from '../../../../../common/commonModels';
import { EditCollectionMessage } from '../../../../../common/messaging/messagesCollections';
import { Separator, SeparatorDirection } from '../../../../components/separator/Separator';
import { BodyText } from '../../../../components/text/Text';
import { ChoiceBox } from '../../../../components/choicebox/ChoiceBox';
import { TextArea } from '../../../../components/textarea/TextArea';

const { ipcRenderer } = window.require('electron');


interface DialogEditCollectionControllerProps {
    collection: Collection,
    onClose: (successful: boolean) => void,

}

interface DialogEditCollectionControllerState {
    name: string,
    nameValid: boolean,
    smartQuery: string,
}

export class DialogEditCollectionController extends Component<DialogEditCollectionControllerProps, DialogEditCollectionControllerState> {

    constructor(props: DialogEditCollectionControllerProps) {
        super(props);
        this.state = {
            name: this.props.collection.name,
            nameValid: true,
            smartQuery: this.props.collection.smartQuery,
        };
        this.typeToDisplayString = this.typeToDisplayString.bind(this);
        this.validate = this.validate.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleRename = this.handleRename.bind(this);
    }

    render(): ReactElement {
        return <DialogEditCollection
            name={this.state.name}
            onChangeName={(name: string) => this.setState({ name: name })}
            type={this.typeToDisplayString(this.props.collection.type)}
            smartQuery={this.state.smartQuery}
            onChangeSmartQuery={(smartQuery: string) => this.setState({ smartQuery: smartQuery })}
            onClose={this.handleCancel}
            onRename={this.handleRename}
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
            EditCollectionMessage.request(ipcRenderer, {
                collectionId: this.props.collection.id,
                newName: this.state.name.trim(),
                newSmartQuery: this.state.smartQuery.trim()
            }).finally(() => this.props.onClose(true));
        }
    }

}


interface DialogEditCollectionProps {

    name: string,
    onChangeName: (name: string) => void

    type: string,

    smartQuery: string,
    onChangeSmartQuery: (query: string) => void

    onClose: () => void
    onRename: () => void
}

function DialogEditCollection(props: React.PropsWithChildren<DialogEditCollectionProps>): React.ReactElement {
    return (
        <Dialog title={"Edit Collection"}
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
                        content: "Save",
                        variant: Variant.SOLID,
                        type: Type.PRIMARY,
                        onAction: props.onRename,
                        triggeredByEnter: true,
                    },
                ]}>
            <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>

                <InputField
                    placeholder='Collection Name'
                    value={props.name}
                    onChange={props.onChangeName}
                />

                <Separator noBorder dir={SeparatorDirection.HORIZONTAL} spacing={Size.S_0_5} />

                <HBox spacing={Size.S_0_25} alignCross={AlignCross.CENTER}>
                    <BodyText disabled={true}>Collection Type:</BodyText>
                    <ChoiceBox variant={Variant.OUTLINE}
                               autoWidth={true}
                               items={["Normal", "Smart"]}
                               selected={props.type}
                               disabled={true}
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

            </VBox>
        </Dialog>
    );
}