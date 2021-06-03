import * as React from 'react';
import { AlignCross, AlignMain, Fill, Size } from '../../common/common';
import { VBox } from '../../layout/box/Box';
import "./sidebarMenuSection.css";
import { H5Text } from '../../base/text/Text';

export interface SidebarMenuSectionProps {
    title?: string
    actionButton?: React.ReactElement,
}

export function SidebarMenuSection(props: React.PropsWithChildren<SidebarMenuSectionProps>): React.ReactElement {


    return (
        <VBox fill={Fill.HORZ}
              alignMain={AlignMain.START}
              alignCross={AlignCross.STRETCH}
              spacing={Size.S_0_25}
              className={"sidebar-menu-section"}
        >

            {props.title && (
                <div className={"sidebar-menu-section-header"}>
                    <div className={"sidebar-menu-section-header-content"}>
                        <H5Text>{props.title}</H5Text>
                        {props.actionButton}
                    </div>
                </div>
            )}

            <VBox fill={Fill.HORZ}
                  alignMain={AlignMain.START}
                  alignCross={AlignCross.STRETCH}
                  spacing={Size.S_0}
                  className={"sidebar-menu-section-items"}
            >
                {props.children}
            </VBox>

        </VBox>
    );
}
