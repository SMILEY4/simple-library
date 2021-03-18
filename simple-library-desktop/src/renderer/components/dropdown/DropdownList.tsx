import React from "react";
import "./dropdown.css";
import { Dropdown } from './Dropdown';
import { DropdownItem } from './DropdownItem';

export interface DropdownListProps {
    items: string[],
    itemFilter?: (item: string) => boolean,

    selectedItem: string | null,
    onSelect?: (item: string) => void,

    maxVisibleItems?: number,
    onTopSide?: boolean,
    className?: string
}

type DropdownListReactProps = React.PropsWithChildren<DropdownListProps>;

export function DropdownList(props: DropdownListReactProps): React.ReactElement {

    return (
        <Dropdown maxVisibleItems={props.maxVisibleItems} onTopSide={props.onTopSide} className={props.className}>
            {
                props.items
                    .filter(item => props.itemFilter ? props.itemFilter(item) : true)
                    .map(item => {
                        return (
                            <DropdownItem
                                selected={item === props.selectedItem}
                                onAction={() => props.onSelect && props.onSelect(item)}
                            >
                                {item}
                            </DropdownItem>
                        );
                    })
            }
        </Dropdown>
    );
}
