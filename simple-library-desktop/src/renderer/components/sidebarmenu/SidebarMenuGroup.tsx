import * as React from 'react';
import { Component, ReactElement } from 'react';
import "./sidebarMenuGroup.css";
import { HiOutlineChevronDown, HiOutlineChevronRight } from 'react-icons/all';
import { SidebarMenuItem } from './SidebarMenuItem';
import { concatClasses } from '../common';

export interface SidebarMenuGroupProps {
    icon?: ReactElement,
    title: string,
    onContextMenu?: (event: React.MouseEvent) => void
    className?: string
}

export interface SidebarMenuGroupState {
    expanded: boolean
}

export class SidebarMenuGroup extends Component<SidebarMenuGroupProps, SidebarMenuGroupState> {

    constructor(props: SidebarMenuGroupProps) {
        super(props);
        this.state = {
            expanded: false,
        };
        this.actionToggle = this.actionToggle.bind(this);
        this.renderIcons = this.renderIcons.bind(this);
        this.renderExpandIcon = this.renderExpandIcon.bind(this);
    }

    actionToggle() {
        this.setState({
            expanded: !this.state.expanded,
        });
    }

    render(): React.ReactElement {
        return (
            <div className={concatClasses("sidebar-menu-group", this.props.className)}>
                <SidebarMenuItem title={this.props.title} icon={this.renderIcons(this.props.icon)} onClick={this.actionToggle} onContextMenu={this.props.onContextMenu} />
                {this.state.expanded && (
                    <div className={"sidebar-menu-group-content"}>
                        {this.props.children}
                    </div>
                )}
            </div>
        );
    }

    renderIcons(customIcon: ReactElement | undefined): ReactElement[] {
        return [
            this.renderExpandIcon(),
            customIcon ? customIcon : null,
        ];
    }

    renderExpandIcon() {
        if (this.state.expanded) {
            return <HiOutlineChevronDown />;
        } else {
            return <HiOutlineChevronRight />;
        }
    }
}
