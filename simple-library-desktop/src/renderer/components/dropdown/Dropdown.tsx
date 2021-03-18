import React, { ReactElement } from "react";
import { VBox } from "../layout/Box";
import { AlignCross, AlignMain, concatClasses, Size } from "../common";
import "./dropdown.css";
import { DropdownItem } from './DropdownItem';

export enum DropdownItemType {
    ACTION = "action"
}

export interface DropdownActionItem {
    type: DropdownItemType,
    title: string,
    onAction?: () => void
}

export interface DropdownProps {
    maxVisibleItems?: number,
    onTopSide?: boolean,
    items?: DropdownActionItem[]
    className?: string,
}

type DropdownReactProps = React.PropsWithChildren<DropdownProps>;

export function Dropdown(props: DropdownReactProps): React.ReactElement {

    function getClassName(props: DropdownReactProps): string {
        return concatClasses(
            "dropdown",
            "with-shadow-1",
            (props.onTopSide === true ? "dropdown-top" : "dropdown-bottom"),
            props.className,
        );
    }

    function renderItems(items: DropdownActionItem[]): ReactElement[] {
        return items.map((item: DropdownActionItem, index: number) => {
            if (item.type === DropdownItemType.ACTION) {
                return (
                    <DropdownItem selected={false}
                                  onAction={() => item.onAction()}
                                  key={index}
                    >
                        {item.title}
                    </DropdownItem>
                );
            }
            return null;
        });
    }

    return (
        <VBox className={getClassName(props)}
              style={props.maxVisibleItems && { maxHeight: (props.maxVisibleItems * 16 * 1.5) + "px" }}
              alignMain={AlignMain.START}
              alignCross={AlignCross.STRETCH}
              spacing={Size.S_0}
        >
            {props.items && renderItems(props.items)}
            {props.children}
        </VBox>
    );
}
