import * as React from 'react';
import { Component } from 'react';
import { SidebarMenu, SidebarMenuProps } from './SidebarMenu';

interface SFSidebarMenuState {
    minimized: boolean
}


export class SFSidebarMenu extends Component<SidebarMenuProps, SFSidebarMenuState> {

    constructor(props: Readonly<SidebarMenuProps>) {
        super(props);
        this.state = {
            minimized: props.minimized ? props.minimized : false,
        };
        this.handleOnToggleMinimize = this.handleOnToggleMinimize.bind(this);
    }


    handleOnToggleMinimize(nowMinimized: boolean): void {
        if (this.props.onToggleMinimize) {
            this.props.onToggleMinimize(nowMinimized);
        }
        this.setState({ minimized: nowMinimized });
    }


    render(): React.ReactElement {
        const sidebarMenuProps: SidebarMenuProps = {
            onToggleMinimize: this.handleOnToggleMinimize,
            minimized: this.state.minimized,
            ...this.props,
        };
        return (
            <SidebarMenu {...sidebarMenuProps} />
        );
    }

}
