import * as React from 'react';
import { useState } from 'react';
import { Group } from '../../../../../../common/commonModels';
import { Dialog } from '../../../../../components/modal/Dialog';
import { AlignCross, AlignMain, Size, Type, Variant } from '../../../../../components/common';
import { VBox } from '../../../../../components/layout/Box';
import { InputField } from '../../../../../components/inputfield/InputField';
import { BodyText } from '../../../../../components/text/Text';
import { useStateRef } from '../../../../common/hooks/miscHooks';

interface NewCreateGroupDialogProps {
    parentGroup: Group,
    rootGroup: Group,
    onCancel: () => void,
    onCreate: (name: string) => void,
}

export function CreateGroupDialog(props: React.PropsWithChildren<NewCreateGroupDialogProps>): React.ReactElement {

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


function useGroupName() {

    const [name, setName, refName] = useStateRef("");
    const [valid, setValid] = useState(true);

    const changeName = (name: string) => {
        setName(name);
        setValid(name.trim().length > 0);
    };

    return {
        name: name,
        getRefName: () => refName.current,
        setName: changeName,
        nameValid: valid,
    };
}
