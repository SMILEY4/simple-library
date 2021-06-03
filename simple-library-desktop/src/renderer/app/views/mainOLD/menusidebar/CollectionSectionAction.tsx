import * as React from 'react';
import { DropdownButton } from '../../../../components/_old/dropdownbutton/DropdownButton';
import { HiPlus } from 'react-icons/all';
import { Variant } from '../../../../components/common/common';
import { DropdownItemType } from '../../../../components/_old/dropdown/Dropdown';

interface CollectionSectionActionProps {
    onCreateCollection: () => void,
    onCreateGroup: () => void
}

export function CollectionSectionAction(props: React.PropsWithChildren<CollectionSectionActionProps>): React.ReactElement {

    return <DropdownButton icon={<HiPlus />} variant={Variant.GHOST} square items={[
        {
            type: DropdownItemType.ACTION,
            title: "New Collection",
            onAction: props.onCreateCollection,
        },
        {
            type: DropdownItemType.ACTION,
            title: "New Group",
            onAction: props.onCreateGroup,
        },
    ]} />;

}
