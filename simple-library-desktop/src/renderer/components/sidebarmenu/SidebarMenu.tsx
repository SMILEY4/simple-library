import * as React from 'react';
import { ReactElement } from 'react';
import { AlignCross, AlignMain, concatClasses, Fill, Size, Variant } from '../common';
import "./sidebarMenu.css";
import { VBox } from '../layout/Box';
import { Button } from '../button/Button';
import { BiChevronsLeft, BiChevronsRight } from 'react-icons/all';

export interface Action {
    text: string,
    icon?: any,
    onAction?: () => void
}

export interface SidebarMenuProps {
    actions: Action[]
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
            props.className
        );
    }

    function getMinimizeButton(minimized: boolean): ReactElement {
        if (minimized) {
            return <BiChevronsRight />;
        } else {
            return <BiChevronsLeft />;
        }
    }

    function getActions(minimized: boolean, actions: Action[]): ReactElement[] {
        if (minimized) {
            return actions.map(action => {
                if (action.icon) {
                    return <Button variant={Variant.GHOST}
                                   icon={action.icon}
                                   onAction={action.onAction}
                                   square={true} />;
                } else {
                    return null;
                }
            });
        } else {
            return actions.map(action => {
                return (
                    <Button variant={Variant.GHOST} icon={action.icon} onAction={action.onAction}>
                        {action.text}
                    </Button>
                );
            });
        }
    }

    return (
        <div className={getClassNames()}>
            <VBox fill={Fill.TRUE}
                  alignMain={props.align}
                  alignCross={props.minimized ? AlignCross.CENTER : AlignCross.STRETCH}
                  spacing={Size.S_0}
            >
                {getActions(props.minimized, props.actions)}
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
