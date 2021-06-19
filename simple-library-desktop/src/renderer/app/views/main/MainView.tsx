import React from "react";
import {VBox} from "../../../components/layout/box/Box";
import {DynamicSlot} from "../../../components/base/slot/DynamicSlot";
import {Slot} from "../../../components/base/slot/Slot";
import {AppLayout} from "../../../components/misc/app/AppLayout";
import {AppToolbar} from "./apptoolbar/AppToolbar";
import {CollectionSidebar, TAB_DATA_COLLECTIONS} from "./sidebarmenu/CollectionSidebar";
import {NotificationStack} from "../../../components/modals/notification/NotificationStack";
import {useNotifications} from "../../hooks/base/notificationHooks";
import {APP_ROOT_ID} from "../../Application";
import {ContentArea} from "./contentarea/ContentArea";

interface MainViewProps {
	onClosed: () => void
}

export function MainView(props: React.PropsWithChildren<MainViewProps>): React.ReactElement {

	const {
		getNotificationStackEntries,
	} = useNotifications();

	return (
		<>
			<VBox fill>

				<AppToolbar onClosedLibrary={props.onClosed}/>

				<AppLayout tabsLeft={[TAB_DATA_COLLECTIONS]}>
					<DynamicSlot name="sidebar-left">
						{(tabId: string) => {
							if (tabId === TAB_DATA_COLLECTIONS.id) {
								return <CollectionSidebar/>;
							} else {
								return null;
							}
						}}
					</DynamicSlot>
					<Slot name={"main"}>
						<ContentArea/>
					</Slot>
				</AppLayout>

			</VBox>

			<NotificationStack
				modalRootId={APP_ROOT_ID}
				entries={getNotificationStackEntries()}
			/>

		</>
	);
}
