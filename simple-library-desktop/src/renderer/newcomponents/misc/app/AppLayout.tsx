import {BaseProps} from "../../common";
import * as React from "react";
import {MutableRefObject, ReactElement, useRef, useState} from "react";
import {Icon, IconType} from "../../base/icon/Icon";
import "./appLayout.css"
import {Label} from "../../base/label/Label";
import {concatClasses, getIf, orDefault} from "../../../components/common/common";
import {Divider} from "../../layout/splitpane/Divider";
import {useAppLayout} from "./useAppLayout";
import {getChildOfSlot} from "../../base/slot/Slot";
import {getChildOfDynamicSlot} from "../../base/slot/DynamicSlot";

export interface SidebarTab {
    id: string,
    title: string,
    icon: IconType
}


interface AppLayoutProps extends BaseProps {
    tabsLeft?: SidebarTab[],
    tabsRight?: SidebarTab[]
}

export function AppLayout(props: React.PropsWithChildren<AppLayoutProps>): ReactElement {

    const refMain = useRef(null);
    const refSidebarLeft = useRef(null);
    const refSidebarRight = useRef(null);

    const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
    const [selectedRight, setSelectedRight] = useState<string | null>(null)

    const {resizeLeft, resizeRight} = useAppLayout(refSidebarLeft, refSidebarRight);

    return (
        <div className="app-layout" ref={refMain}>

            <AppTabBar
                side="left"
                tabs={props.tabsLeft}
                selectedTabId={selectedLeft}
                onSelect={setSelectedLeft}
            />

            <div className="app-layout-area-resizeable">

                <AppSidebar selectedTabId={selectedLeft} forwardRef={refSidebarLeft}>
                    {getSidebarContentLeft()}
                </AppSidebar>

                <Divider
                    style={{display: selectedLeft ? undefined : "none"}}
                    __parentRef={refMain}
                    __mode="vertical"
                    __onDrag={resizeLeft}
                />

                <div className="app-layout-main">
                    {getMainContent()}
                </div>

                <Divider
                    style={{display: selectedRight ? undefined : "none"}}
                    __parentRef={refMain}
                    __mode="vertical"
                    __onDrag={resizeRight}
                />

                <AppSidebar selectedTabId={selectedRight} forwardRef={refSidebarRight}>
                    {getSidebarContentRight()}
                </AppSidebar>

            </div>

            <AppTabBar
                side="right"
                tabs={props.tabsRight}
                selectedTabId={selectedRight}
                onSelect={setSelectedRight}
            />

        </div>
    );


    function getSidebarContentLeft(): ReactElement {
        return getChildOfDynamicSlot(props.children, "sidebar-left", selectedLeft)
    }

    function getSidebarContentRight(): ReactElement {
        return getChildOfDynamicSlot(props.children, "sidebar-left", selectedRight)
    }

    function getMainContent(): ReactElement {
        return getChildOfSlot(props.children, "main")
    }

}


interface AppTabBarProps {
    side: "left" | "right",
    tabs?: SidebarTab[],
    selectedTabId: string | null,
    onSelect?: (tabId: string | null) => void
}

function AppTabBar(props: React.PropsWithChildren<AppTabBarProps>): ReactElement | null {

    if (props.tabs) {
        return (
            <div className={"app-layout-tab-bar app-layout-tab-bar-" + props.side}>
                {buildTabs()}
            </div>
        )
    } else {
        return null;
    }

    function buildTabs(): ReactElement[] {
        return orDefault(props.tabs, []).map((tab: SidebarTab) => {
            return (
                <Label className={concatClasses(
                    "app-layout-tab",
                    getIf(tab.id === props.selectedTabId, "app-layout-tab-selected")
                )}
                       noSelect
                       onClick={() => handleClickTab(tab.id)}
                >
                    <Icon type={tab.icon} size="0-75"/>
                    {tab.title}
                </Label>
            );
        });
    }

    function handleClickTab(tabId: string) {
        if (tabId === props.selectedTabId) {
            props.onSelect(null);
        } else {
            props.onSelect(tabId);
        }
    }

}


interface AppSidebarProps {
    selectedTabId: string | undefined,
    forwardRef: MutableRefObject<any>
}

function AppSidebar(props: React.PropsWithChildren<AppSidebarProps>): ReactElement {
    return (
        <div
            className="app-layout-sidebar"
            style={{display: props.selectedTabId ? undefined : "none"}}
            ref={props.forwardRef}
        >
            {props.selectedTabId && props.children}
        </div>
    );
}
