import * as React from 'react';
import { AlignCross, AlignMain, Fill, Size } from '../common';
import { VBox } from '../layout/Box';
import "./sidebarMenuSection.css";
import { H5Text } from '../text/Text';

export interface SidebarMenuSectionProps {
    title?: string
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
                <div className={"sidebar-menu-section-title"}>
                    <H5Text>{props.title}</H5Text>
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
