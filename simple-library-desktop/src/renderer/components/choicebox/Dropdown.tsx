import React, {ReactElement} from "react";
import {VBox} from "../layout/Box";
import {AlignCross, AlignMain, concatClasses, Size} from "../common";
import {AiOutlineCheck} from "react-icons/all";
import "./dropdown.css"

export interface DropdownProps {
    items: string[],
    itemFilter?: (item: string) => boolean,
    selectedItem: string | null,
    onSelect?: (item: string) => void,
    maxVisibleItems?: number,
    onTopSide?: boolean,
    className?: string
}

type DropdownReactProps = React.PropsWithChildren<DropdownProps>;

export function Dropdown(props: DropdownReactProps): React.ReactElement {

    function getClassName(props: DropdownReactProps): string {
        return concatClasses(
            "dropdown",
            "with-shadow-1",
            (props.onTopSide === true ? "dropdown-top" : "dropdown-bottom"),
            props.className
        )
    }

    function renderItem(item: string, selectedItem: string): ReactElement {
        const isSelected = selectedItem === item;
        return (
            <div className={"dropdown-item behaviour-no-select" + (isSelected ? " dropdown-item-selected" : "")}
                 onClick={() => props.onSelect && props.onSelect(item)}>
                {isSelected && (
                    <div className={"dropdown-item-icon"}>
                        <AiOutlineCheck/>
                    </div>
                )}
                <div className={"dropdown-item-content"}>{item}</div>
            </div>
        );
    }

    return (
        <VBox className={getClassName(props)}
              style={props.maxVisibleItems && {maxHeight: (props.maxVisibleItems * 16 * 1.5) + "px"}}
              alignMain={AlignMain.START}
              alignCross={AlignCross.STRETCH}
              spacing={Size.S_0}
        >
            {props.items
                .filter(item => props.itemFilter ? props.itemFilter(item) : true)
                .map(item => renderItem(item, props.selectedItem))}
        </VBox>
    );
}
