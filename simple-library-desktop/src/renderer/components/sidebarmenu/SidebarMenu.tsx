import * as React from 'react';
import { ReactElement } from 'react';
import { AlignCross, AlignMain, concatClasses, Fill, Size, Variant } from '../common';
import "./sidebarMenu.css";
import { VBox } from '../layout/Box';
import { Button } from '../button/Button';
import { BiChevronsLeft, BiChevronsRight } from 'react-icons/all';
import { H4Text } from '../text/Text';

export interface SidebarAction {
    typeID?: "ACTION"
    text: string,
    icon?: any,
    onAction?: () => void
}

export interface SidebarSectionTitle {
    typeID?: "SECTION-TITLE"
    text: string,
}

export type SidebarElement = SidebarAction | SidebarSectionTitle;

export interface SidebarMenuProps {
    elements: SidebarElement[]
    align: AlignMain,
    fillHeight?: boolean,
    minimizable?: boolean,
    minimized?: boolean,
    onToggleMinimize?: (minimize: boolean) => void,
    className?: string,
}

export function SidebarMenu(props: React.PropsWithChildren<SidebarMenuProps>): React.ReactElement {

    function getClassNames(): string {
        return concatClasses(
            "sidebar-menu",
            (props.minimized ? "sidebar-menu-minimized" : "sidebar-menu-maximized"),
            (props.fillHeight === false ? undefined : "fill-vert"),
            props.className,
        );
    }

    function getMinimizeButton(minimized: boolean): ReactElement {
        if (minimized) {
            return <BiChevronsRight />;
        } else {
            return <BiChevronsLeft />;
        }
    }


    function renderAction(minimized: boolean, action: SidebarAction): ReactElement {
        if (minimized) {
            if (action.icon) {
                return <Button variant={Variant.GHOST}
                               icon={action.icon}
                               onAction={action.onAction}
                               square={true} />;
            } else {
                return null;
            }
        } else {
            return (
                <Button variant={Variant.GHOST} icon={action.icon} onAction={action.onAction}>
                    {action.text}
                </Button>
            );
        }
    }

    function renderSectionTitle(minimized: boolean, sectionTitle: SidebarSectionTitle): ReactElement {
        if (minimized) {
            return null;
        } else {
            return <H4Text className={"sidebar-section-title"}>{sectionTitle.text}</H4Text>;
        }
    }

    function renderElements(minimized: boolean, elements: SidebarElement[]): ReactElement[] {
        return elements.map(element => {
            if (element.typeID === "ACTION") {
                return renderAction(minimized, element);
            }
            if (element.typeID === "SECTION-TITLE") {
                return renderSectionTitle(minimized, element);
            }
        });
    }

    return (
        <div className={getClassNames()}>
            <VBox fill={Fill.TRUE}
                  alignMain={props.align}
                  alignCross={props.minimized ? AlignCross.CENTER : AlignCross.STRETCH}
                  spacing={Size.S_0}
            >
                {renderElements(props.minimized, props.elements)}
            </VBox>
            {props.minimizable && (
                <Button className={"sidebar-btn-minimize"}
                        variant={Variant.GHOST}
                        icon={getMinimizeButton(props.minimized)}
                        onAction={() => props.onToggleMinimize && props.onToggleMinimize(!props.minimized)}
                        square={true}
                />
            )}
        </div>
    );
}
