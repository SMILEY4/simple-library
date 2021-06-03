import {AlignCross, AlignMain, BaseProps, ColorType, concatClasses, getIf, Size} from "../../../common/common";
import {Icon, IconType} from "../../../base/icon/Icon";
import * as React from "react";
import {ReactElement, useState} from "react";
import {SidebarItem} from "../item/SidebarItem";
import {HBox, VBox} from "../../../layout/box/Box";
import "./sidebarGroupItem.css"

export interface SidebarGroupItemProps extends BaseProps {
    title?: string,
    icon?: IconType,
    label?: string,
    mini?: boolean
}

export function SidebarGroupItem(props: React.PropsWithChildren<SidebarGroupItemProps>): ReactElement {

    const [expanded, setExpanded] = useState(false);

    return (
        <VBox
            className={"sidebar-group-item-wrapper"}
            alignMain={AlignMain.START}
            alignCross={AlignCross.STRETCH}
            spacing={Size.S_0_25}
        >
            <HBox className={concatClasses("sidebar-group-item", props.className)}
                  alignCross={AlignCross.CENTER}
                  alignMain={AlignMain.START}
                  spacing={Size.S_0_15}
                  padding={Size.S_0}
                  style={props.style}
                  forwardRef={props.forwardRef}
                  onClick={handleAction}
            >
                <Icon
                    type={expanded ? IconType.CHEVRON_DOWN : IconType.CHEVRON_RIGHT}
                    color={ColorType.TEXT_1}
                    size={Size.S_0_75}
                />
                <SidebarItem
                    title={props.title}
                    icon={props.icon}
                    label={props.label}
                    mini={props.mini}
                />
            </HBox>
            {expanded && (
                <VBox
                    className={"sidebar-group-item-list"}
                    alignMain={AlignMain.START}
                    alignCross={AlignCross.STRETCH}
                    spacing={Size.S_0_25}
                >
                    {props.children}
                </VBox>
            )}
        </VBox>
    );

    function handleAction() {
        setExpanded(!expanded);
    }

}
