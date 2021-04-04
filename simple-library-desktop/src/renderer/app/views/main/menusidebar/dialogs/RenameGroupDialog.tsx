import * as React from 'react';
import { Group } from '../../../../../../common/commonModels';
import { Dialog } from '../../../../../components/modal/Dialog';
import { AlignCross, AlignMain, Size, Type, Variant } from '../../../../../components/common';
import { VBox } from '../../../../../components/layout/Box';
import { InputField } from '../../../../../components/inputfield/InputField';
import { useGroupName } from '../../../../hooks/groupHooks';

interface RenameGroupDialogProps {
    group: Group,
    onCancel: () => void,
    onRename: (groupId: number, name: string) => void,
}

export function RenameGroupDialog(props: React.PropsWithChildren<RenameGroupDialogProps>): React.ReactElement {

    const { name, nameValid, getRefName, setName } = useGroupName(props.group.name);

    return (
        <Dialog title={"Rename Group"}
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
                        content: "Rename",
                        variant: Variant.SOLID,
                        type: Type.PRIMARY,
                        onAction: handleRename,
                        triggeredByEnter: true,
                    },
                ]}>

            <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>
                <InputField
                    autoFocus
                    placeholder='Group Name'
                    value={name}
                    onChange={setName}
                    invalid={!nameValid}
                />
            </VBox>

        </Dialog>
    );

    function handleRename() {
        if (nameValid) {
            props.onRename(props.group.id, getRefName());
        }
    }

}