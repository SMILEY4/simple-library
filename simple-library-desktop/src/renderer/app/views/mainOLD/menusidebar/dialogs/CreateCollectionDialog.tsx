import * as React from 'react';
import { CollectionType, Group } from '../../../../../../common/commonModels';
import { Dialog } from '../../../../../components/_old/modal/Dialog';
import { AlignCross, AlignMain, Size, Type, Variant } from '../../../../../components/common/common';
import { HBox, VBox } from '../../../../../components/layout/box/Box';
import { InputField } from '../../../../../components/_old/inputfield/InputField';
import { Separator, SeparatorDirection } from '../../../../../components/_old/separator/Separator';
import { BodyText } from '../../../../../components/base/text/Text';
import { ChoiceBox } from '../../../../../components/_old/choicebox/ChoiceBox';
import { TextArea } from '../../../../../components/_old/textarea/TextArea';
import { useCollectionName, useCollectionQuery, useCollectionType } from '../../../../hooks/old/collectionHooks';

interface CreateCollectionDialogProps {
    parentGroup: Group,
    rootGroup: Group,
    onCancel: () => void,
    onCreate: (name: string, type: CollectionType, query: string) => void,
}

export function CreateCollectionDialog(props: React.PropsWithChildren<CreateCollectionDialogProps>): React.ReactElement {

    const { name, nameValid, getRefName, setName } = useCollectionName();
    const { type, getRefType, setType, isNormal } = useCollectionType();
    const { query, getRefQuery, setQuery } = useCollectionQuery();

    return (
        <Dialog title={"Create new Collection"}
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
                        content: "Create",
                        variant: Variant.SOLID,
                        type: Type.PRIMARY,
                        onAction: handleCreate,
                        triggeredByEnter: true,
                    },
                ]}>
            <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>

                <InputField
                    autoFocus
                    placeholder='Collection Name'
                    value={name}
                    onChange={setName}
                    invalid={!nameValid}
                />

                <Separator noBorder dir={SeparatorDirection.HORIZONTAL} spacing={Size.S_0_5} />

                <HBox spacing={Size.S_0_25} alignCross={AlignCross.CENTER}>
                    <BodyText>Collection Type:</BodyText>
                    <ChoiceBox variant={Variant.OUTLINE}
                               autoWidth={true}
                               items={["Normal", "Smart"]}
                               selected={typeToString(type)}
                               onSelect={(value: string) => setType(stringToType(value))}
                    />
                </HBox>

                <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_25} padding={Size.S_1} outlined>
                    <BodyText disabled={isNormal()}>Smart-Collection Query:</BodyText>
                    <TextArea
                        value={query}
                        onChange={setQuery}
                        disabled={isNormal()}
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

    function handleCreate() {
        if (nameValid) {
            props.onCreate(getRefName(), getRefType(), getRefQuery());
        }
    }

    function typeToString(type: CollectionType): string {
        switch (type) {
            case CollectionType.NORMAL:
                return "Normal";
            case CollectionType.SMART:
                return "Smart";
        }
    }

    function stringToType(str: string): CollectionType {
        return str === "Smart" ? CollectionType.SMART : CollectionType.NORMAL;
    }

}