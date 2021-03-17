import * as React from 'react';
import { ReactElement } from 'react';
import { Button, ButtonProps } from '../Button';
import { Dropdown, DropdownProps } from '../../dropdown/Dropdown';


export interface DropdownButtonProps extends Omit<ButtonProps, 'renderAsActive'>, DropdownProps {
    onToggle?: (active: boolean) => void
    showDropdown?: boolean,
}

export function DropdownButton(props: React.PropsWithChildren<DropdownButtonProps>): ReactElement {

    function handleClick() {
        if (props.onToggle && !props.disabled) {
            props.onToggle(!props.showDropdown);
        }
    }

    function getButtonProps(): ButtonProps {
        return {
            renderAsActive: false,
            onAction: handleClick,
            ...props,
        };
    }

    return (
        <div className={"dropdown-button"}>
            <Button {...getButtonProps()}>
                {props.children}
            </Button>
            {
                props.showDropdown && (
                    <Dropdown className={"choicebox-dropdown"}
                              items={props.items}
                              itemFilter={props.itemFilter}
                              selectedItem={props.selectedItem}
                              onSelect={props.onSelect}
                              maxVisibleItems={props.maxVisibleItems}
                              onTopSide={props.onTopSide} />
                )
            }
        </div>
    );
}
