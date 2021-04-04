import * as React from 'react';
import { Group } from '../../../../../../common/commonModels';
import { Dialog } from '../../../../../components/modal/Dialog';
import { AlignCross, AlignMain, Size, Type, Variant } from '../../../../../components/common';
import { VBox } from '../../../../../components/layout/Box';
import { InputField } from '../../../../../components/inputfield/InputField';
import { BodyText } from '../../../../../components/text/Text';
import { useGroupName } from '../../../../hooks/groupHooks';

interface CreateGroupDialogProps {
    parentGroup: Group,
    rootGroup: Group,
    onCancel: () => void,
    onCreate: (name: string) => void,
}

export function CreateGroupDialog(props: React.PropsWithChildren<CreateGroupDialogProps>): React.ReactElement {

    const { name, nameValid, getRefName, setName } = useGroupName();

    return (
        <Dialog title={"Create new Group"}
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
                    placeholder='Group Name'
                    value={name}
                    onChange={setName}
                />
                {props.parentGroup && (
                    <BodyText>{'Create in group "' + props.parentGroup.name + '".'} </BodyText>
                )}
            </VBox>

        </Dialog>
    );

    function handleCreate() {
        if (nameValid) {
            props.onCreate(getRefName());
        }
    }

}
