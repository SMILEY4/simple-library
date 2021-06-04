import * as React from 'react';
import { Group } from '../../../../../../common/commonModels';
import { Dialog } from '../../../../../components/_old/modal/Dialog';
import { AlignCross, AlignMain, Size, Type, Variant } from '../../../../../components/common/common';
import { VBox } from '../../../../../components/layout/box/Box';
import { BodyText } from '../../../../../components/base/text/Text';
import { useCreateGroupDialog } from '../../../../hooks/old/groupHooks';
import { NewInputField } from '../../../../../components/_old/newinputfield/NewInputField';

interface CreateGroupDialogProps {
    parentGroup: Group,
    rootGroup: Group,
    onCancel: () => void,
    onCreate: (name: string) => void,
}

export function CreateGroupDialog(props: React.PropsWithChildren<CreateGroupDialogProps>): React.ReactElement {

    const { getRefName, setName, validateName, valid, setValid, getRefValid } = useCreateGroupDialog();

    let validate: null | (() => boolean) = null;

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
                        disabled: !valid,
                        triggeredByEnter: true,
                    },
                ]}>

            <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>
                <NewInputField
                    placeholder='Group Name'
                    onSubmit={setName}
                    autoFocus
                    validateOnSubmit
                    validateOnChange
                    showError
                    validation={validateName}
                    onValidated={setValid}
                    triggerValidation={fun => validate = fun}
                />
                {props.parentGroup && (
                    <BodyText>{'Create in group "' + props.parentGroup.name + '".'} </BodyText>
                )}
            </VBox>

        </Dialog>
    );

    function handleCreate() {
        if (validate() && getRefValid()) {
            props.onCreate(getRefName());
        }
    }

}
