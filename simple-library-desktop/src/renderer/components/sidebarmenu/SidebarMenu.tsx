import * as React from 'react';
import { AlignCross, AlignMain, concatClasses, Fill, Size, Variant } from '../common';
import "./sidebarMenu.css";
import { VBox } from '../layout/Box';
import { Button } from '../button/Button';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/all';


export interface SidebarMenuProps {
    fillHeight?: boolean,
    className?: string,
    minimizable?: boolean,
    minimized?: boolean,
    onToggleMinimized?: (minimized:boolean) => void,
    style?: React.CSSProperties,
}

export function SidebarMenu(props: React.PropsWithChildren<SidebarMenuProps>): React.ReactElement {

    function getClassNames(): string {
        return concatClasses(
            "sidebar-menu",
            (props.minimized === false ? undefined : "sidebar-menu-minimized"),
            (props.fillHeight === false ? undefined : "fill-vert"),
            props.className,
        );
    }


    return (
        <div className={getClassNames()} style={props.style}>
            <VBox fill={Fill.TRUE}
                  alignMain={AlignMain.START}
                  alignCross={AlignCross.STRETCH}
                  spacing={Size.S_1_5}
                  padding={Size.S_0_5}
                  className='sidebar-menu-content-area'
            >
                {props.children}
            </VBox>
            {props.minimizable && (
                <Button className={"sidebar-menu-minimize-button"}
                        variant={Variant.GHOST}
                        icon={props.minimized ? <HiOutlineChevronDoubleRight /> : <HiOutlineChevronDoubleLeft />}
                        onAction={() => props.onToggleMinimized && props.onToggleMinimized(!props.minimized)}
                        square
                />
            )}
        </div>
    );
}
