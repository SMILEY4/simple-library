import {AlignCross, AlignMain, BaseProps, ColorType, Size} from "../../common/common";
import * as React from "react";
import {ReactElement} from "react";
import {Box, HBox} from "../../layout/box/Box";
import "./sidebarItem.css"
import {Icon, IconType} from "../../base/icon/Icon";
import {CaptionText} from "../../base/text/Text";

export interface SidebarItemProps extends BaseProps {
    title?: string,
    icon?: IconType,
    label?: string,
    mini?: boolean
}

export function SidebarItem(props: React.PropsWithChildren<SidebarItemProps>): ReactElement {

    if(props.mini === true) {
        return (
            <HBox className={"sidebar-item behaviour-no-select"}
                  alignCross={AlignCross.STRETCH}
                  alignMain={AlignMain.START}
                  spacing={Size.S_0_25}
                  padding={Size.S_0_15}
            >
                <Box className={"sidebar-item-icon"}>
                    {props.icon && (
                        <Icon type={props.icon} color={ColorType.TEXT_1} size={Size.S_0_75}/>
                    )}
                </Box>
            </HBox>
        );

    } else {
        return (
            <HBox className={"sidebar-item behaviour-no-select"}
                  alignCross={AlignCross.STRETCH}
                  alignMain={AlignMain.START}
                  spacing={Size.S_0_25}
                  padding={Size.S_0_15}
            >
                <Box className={"sidebar-item-icon"}>
                    {props.icon && (
                        <Icon type={props.icon} color={ColorType.TEXT_1} size={Size.S_0_75}/>
                    )}
                </Box>
                <HBox className={"sidebar-item-title"} alignMain={AlignMain.START}>
                    {props.title}
                </HBox>
                <HBox className={"sidebar-item-label"} alignMain={AlignMain.END}>
                    <CaptionText>{props.label}</CaptionText>
                </HBox>
            </HBox>
        );
    }


}
