import * as React from 'react';
import { DropdownButton } from '../../../../components/dropdownbutton/DropdownButton';
import { HiPlus } from 'react-icons/all';
import { Variant } from '../../../../components/common';
import { DropdownItemType } from '../../../../components/dropdown/Dropdown';

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
