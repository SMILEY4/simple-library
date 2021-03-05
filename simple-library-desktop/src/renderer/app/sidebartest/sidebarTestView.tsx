import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Grid } from '../../components/layout/Grid';
import { Fill } from '../../components/common';
import { SidebarMenu } from '../../components/sidebarmenu/SidebarMenu';
import { SidebarMenuSection } from '../../components/sidebarmenu/SidebarMenuSection';
import { SidebarMenuItem } from '../../components/sidebarmenu/SidebarMenuItem';
import {
    AiOutlinePushpin,
    AiOutlineTeam,
    HiOutlineCalendar,
    HiOutlineChevronDown, HiOutlineDocumentText, HiOutlineFolder,
    HiOutlineInbox,
    HiOutlineRss,
    HiOutlineTrash,
    HiSearch,
    IoFlashOutline,
} from 'react-icons/all';
import {
    SidebarMenuGroup,
    SidebarMenuGroupProps,
    SidebarMenuGroupState,
} from '../../components/sidebarmenu/SidebarMenuGroup';

export interface SidebarTestViewProps {

}

export interface SidebarTestViewState {
    minimized: boolean
}



export class SidebarTestView extends Component<SidebarTestViewProps, SidebarTestViewState> {

    constructor(props: SidebarTestViewProps) {
        super(props);
        this.state = {
            minimized: false
        }
    }

    render(): ReactElement {
        return (
            <Grid columns={[(this.state.minimized ? "var(--s-3)" : 'var(--s-12)'), '1fr']} rows={['100vh']} fill={Fill.TRUE} style={{
                maxHeight: "100vh",
            }}>

                <SidebarMenu fillHeight minimizable={true} minimized={this.state.minimized} onToggleMinimized={(mini:boolean) => this.setState({minimized: !this.state.minimized})}>

                    <SidebarMenuSection title='Actions'>
                        <SidebarMenuItem title={"Search"} icon={<HiSearch />} label={undefined} />
                        <SidebarMenuItem title={"Inbox"} icon={<HiOutlineInbox />} label={"4"} />
                        <SidebarMenuItem title={"Pinboard"} icon={<AiOutlinePushpin />} label={"2"} />
                        <SidebarMenuItem title={"Today"} icon={<HiOutlineCalendar />} label={"4"} />
                        <SidebarMenuItem title={"Tomorrow"} icon={<HiOutlineCalendar />} label={"3"} />
                        <SidebarMenuItem title={"Trash"} icon={<HiOutlineTrash />} label={"12"} />
                    </SidebarMenuSection>

                    <SidebarMenuSection title='Workspace'>
                        <SidebarMenuItem title={"Library"} icon={<IoFlashOutline />} label={undefined} />
                        <SidebarMenuItem title={"Feed"} icon={<HiOutlineRss />} label={"5"} />
                        <SidebarMenuItem title={"Team feed"} icon={<AiOutlineTeam />} label={"1"} />
                        <SidebarMenuItem title={"Show more"} icon={<HiOutlineChevronDown />} label={undefined} />
                    </SidebarMenuSection>

                    <SidebarMenuSection title='Project'>

                        <SidebarMenuGroup title={"Public"} icon={<HiOutlineFolder />}>
                            <SidebarMenuItem title={"Features"} icon={<HiOutlineDocumentText />} />
                            <SidebarMenuItem title={"Bugs"} icon={<HiOutlineDocumentText />} selected />
                            <SidebarMenuItem title={"Features"} icon={<HiOutlineDocumentText />} />

                            <SidebarMenuGroup title={"Documentation"} icon={<HiOutlineFolder />}>
                                <SidebarMenuItem title={"API"} icon={<HiOutlineDocumentText />} />
                                <SidebarMenuItem title={"Wiki"} icon={<HiOutlineDocumentText />} />
                                <SidebarMenuItem title={"Notes"} icon={<HiOutlineDocumentText />} />
                            </SidebarMenuGroup>

                        </SidebarMenuGroup>

                        <SidebarMenuGroup title={"Local"} icon={<HiOutlineFolder />}>
                            <SidebarMenuItem title={"Secrets"} icon={<HiOutlineDocumentText />} />
                            <SidebarMenuItem title={"Repository"} icon={<HiOutlineDocumentText />} />
                            <SidebarMenuItem title={"Inspiration"} icon={<HiOutlineDocumentText />} />
                        </SidebarMenuGroup>
                    </SidebarMenuSection>

                </SidebarMenu>

                <div style={{
                    backgroundColor: "var(--background-color-1)",
                    borderRadius: "10px",
                    margin: "var(--s-0-5)",
                }} />

            </Grid>
        );
    }
}