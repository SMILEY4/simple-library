import * as React from 'react';
import { Group } from '../../../../../../common/commonModels';
import { Dialog } from '../../../../../components/modal/Dialog';
import { AlignCross, AlignMain, Size, Type, Variant } from '../../../../../components/common';
import { VBox } from '../../../../../components/layout/Box';
import { BodyText } from '../../../../../components/text/Text';
import { useStateRef } from '../../../../hooks/miscHooks';
import { Checkbox } from '../../../../../components/checkbox/Checkbox';

interface DeleteGroupDialogProps {
    group: Group,
    onCancel: () => void,
    onDelete: (groupId: number, deleteChildren: boolean) => void,
}

export function DeleteGroupDialog(props: React.PropsWithChildren<DeleteGroupDialogProps>): React.ReactElement {

    const [deleteChildren, setDeleteChildren] = useStateRef(true);

    return (
        <Dialog title={"Delete Group"}
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
                        content: "Delete",
                        variant: Variant.SOLID,
                        type: Type.ERROR,
                        onAction: handleDelete,
                        triggeredByEnter: true,
                    },
                ]}>
            <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>
                <BodyText>
                    {'Are you sure you want to delete the group "' + props.group.name + '"?'}
                </BodyText>
                <Checkbox variant={Variant.OUTLINE}
                          selected={deleteChildren}
                          onToggle={setDeleteChildren}>
                    {'Delete elements inside "' + props.group.name + '".'}
                </Checkbox>
            </VBox>
        </Dialog>
    );

    function handleDelete() {
        props.onDelete(props.group.id, deleteChildren);
    }
}