import * as React from 'react';
import { AlignCross, AlignMain, Fill, Size, Variant } from '../common';
import { VBox } from '../layout/Box';
import "./sidebarMenuSection.css";
import { H5Text } from '../text/Text';
import { Button } from '../button/Button';

export interface SidebarMenuSectionProps {
    title?: string

    actionButtonIcon?: React.ReactElement,
    onAction?: () => void
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
                    <div className={"sidebar-menu-section-title-content"}>
                        <H5Text>{props.title}</H5Text>
                        {props.actionButtonIcon && (
                            <Button variant={Variant.GHOST}
                                    icon={props.actionButtonIcon}
                                    onAction={props.onAction}
                                    square />
                        )}
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
