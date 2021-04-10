import * as React from 'react';
import { SidebarMenuItem } from '../../../../components/sidebarmenu/SidebarMenuItem';
import { AiOutlineCloseCircle, BiImport, HiOutlineRefresh, HiPlus } from 'react-icons/all';
import { DropdownButton } from '../../../../components/button/dropdownbutton/DropdownButton';
import { Variant } from '../../../../components/common';
import { DropdownItemType } from '../../../../components/dropdown/Dropdown';


interface SimpleMenuActionProps {
    onAction: () => void,
}

export function MenuActionImport(props: React.PropsWithChildren<SimpleMenuActionProps>): React.ReactElement {
    return <SidebarMenuItem
        title={"Import"}
        icon={<BiImport />}
        onClick={props.onAction}
    />;
}

export function MenuActionClose(props: React.PropsWithChildren<SimpleMenuActionProps>): React.ReactElement {
    return <SidebarMenuItem
        title={"Close"}
        icon={<AiOutlineCloseCircle />}
        onClick={props.onAction}
    />;
}