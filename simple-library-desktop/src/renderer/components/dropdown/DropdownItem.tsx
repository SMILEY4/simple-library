import React from "react";
import "./dropdown.css";
import { AiOutlineCheck } from 'react-icons/all';
import { concatClasses } from '../common';

export interface DropdownItemProps {
    selected?: boolean,
    onAction?: () => void,
    className?: string
}

type DropdownItemReactProps = React.PropsWithChildren<DropdownItemProps>;

export function DropdownItem(props: DropdownItemReactProps): React.ReactElement {

    function getClassNames(): string {
        return concatClasses(
            "dropdown-item",
            "behaviour-no-select",
            (props.selected ? " dropdown-item-selected" : ""),
        );
    }

    return (
        <div className={getClassNames()} onClick={props.onAction}>
            {props.selected && (
                <div className={"dropdown-item-icon"}>
                    <AiOutlineCheck />
                </div>
            )}
            <div className={"dropdown-item-content"}>{props.children}</div>
        </div>
    );
}
