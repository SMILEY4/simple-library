import React, {useState} from "react";
import {VBox} from "../../../newcomponents/layout/box/Box";
import {IconType} from "../../../newcomponents/base/icon/Icon";
import {DynamicSlot} from "../../../newcomponents/base/slot/DynamicSlot";
import {TreeView} from "../../../newcomponents/misc/tree/TreeView";
import {getTreeData} from "../../../newcomponents/_showcase/sampleData";
import {Slot} from "../../../newcomponents/base/slot/Slot";
import {AppLayout} from "../../../newcomponents/misc/app/AppLayout";
import {MainToolbar} from "./MainToolbar";
import {requestCloseLibrary} from "../../common/messaging/messagingInterface";

interface MainViewProps {
	onClose: () => void
}

export function MainView(props: React.PropsWithChildren<MainViewProps>): React.ReactElement {

	const [expanded, setExpanded] = useState<string[]>([]);

	function handleToggleExpand(nodeId: string, isExpanded: boolean) {
		if (isExpanded) {
			setExpanded([...expanded, nodeId])
		} else {
			setExpanded(expanded.filter(expandedId => expandedId !== nodeId))
		}
	}

	return (
		<VBox fill>

			<MainToolbar
				onCloseLibrary={handleCloseLibrary}
				onImport={handleStartImport}
			/>

			{/*App layout temporary - only for visualisation*/}
			<AppLayout
				tabsLeft={[
					{
						id: "tab-left-1",
						title: "Tab 1",
						icon: IconType.HOME
					},
					{
						id: "tab-left-2",
						title: "Tab 2",
						icon: IconType.HOME
					}
				]}
				tabsRight={[
					{
						id: "tab-right-1",
						title: "Tab 1",
						icon: IconType.HOME
					},
					{
						id: "tab-right-2",
						title: "Tab 2",
						icon: IconType.HOME
					}
				]}
			>
				<DynamicSlot name="sidebar-left">
					{(tabId: string) => (
						<TreeView
							rootNode={getTreeData()}
							modalRootId={"showcase-root"}
							forceExpanded={expanded}
							onToggleExpand={handleToggleExpand}
						/>
					)}
				</DynamicSlot>
				<DynamicSlot name="sidebar-right">
					{(tabId: string) => <div>{"Show " + tabId}</div>}
				</DynamicSlot>
				<Slot name={"main"}>
					Main Area
				</Slot>
			</AppLayout>
		</VBox>
	);


	function handleCloseLibrary(): void {
		requestCloseLibrary()
			.then(() => props.onClose())
	}

	function handleStartImport(): void {
		console.log("start import")
	}

}
