import * as React from 'react';
import { Collection, CollectionType } from '../../../../../../common/commonModels';
import { Dialog } from '../../../../../components/_old/modal/Dialog';
import { AlignCross, AlignMain, Size, Type, Variant } from '../../../../../components/common/common';
import { HBox, VBox } from '../../../../../components/layout/box/Box';
import { InputField } from '../../../../../components/_old/inputfield/InputField';
import { BodyText } from '../../../../../components/base/text/Text';
import { Separator, SeparatorDirection } from '../../../../../components/_old/separator/Separator';
import { ChoiceBox } from '../../../../../components/_old/choicebox/ChoiceBox';
import { TextArea } from '../../../../../components/_old/textarea/TextArea';
import { useCollectionName, useCollectionQuery } from '../../../../hooks/collectionHooks';

interface EditCollectionDialogProps {
    collection: Collection,
    onCancel: () => void,
    onEdit: (collectionId: number, name: string, query: string) => void,
}

export function EditCollectionDialog(props: React.PropsWithChildren<EditCollectionDialogProps>): React.ReactElement {

    const { name, nameValid, getRefName, setName } = useCollectionName(props.collection.name);
    const { query, getRefQuery, setQuery } = useCollectionQuery(props.collection.smartQuery);

    return (
        <Dialog title={"Edit Collection"}
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
                        content: "Save",
                        variant: Variant.SOLID,
                        type: Type.PRIMARY,
                        onAction: handleEdit,
                        triggeredByEnter: true,
                    },
                ]}>
            <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>

                <InputField
                    placeholder='Collection Name'
                    value={name}
                    onChange={setName}
                    invalid={!nameValid}
                />

                <Separator noBorder dir={SeparatorDirection.HORIZONTAL} spacing={Size.S_0_5} />

                <HBox spacing={Size.S_0_25} alignCross={AlignCross.CENTER}>
                    <BodyText disabled={true}>Collection Type:</BodyText>
                    <ChoiceBox variant={Variant.OUTLINE}
                               autoWidth={true}
                               items={["Normal", "Smart"]}
                               selected={props.collection.type === CollectionType.SMART ? "Smart" : "Normal"}
                               disabled={true}
                    />
                </HBox>

                <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_25} padding={Size.S_1} outlined>
                    <BodyText disabled={isNormalCollection()}>Smart-Collection Query:</BodyText>
                    <TextArea
                        value={query}
                        onChange={setQuery}
                        disabled={isNormalCollection()}
                        placeholder={"Leave empty to match all items."}
                        rows={5}
                        cols={40}
                    />
                </VBox>

            </VBox>
        </Dialog>
    );

    function isNormalCollection() {
        return props.collection.type === CollectionType.NORMAL;
    }

    function handleEdit() {
        if (nameValid) {
            props.onEdit(props.collection.id, getRefName(), props.collection.type === CollectionType.SMART ? getRefQuery() : null);
        }
    }

}
