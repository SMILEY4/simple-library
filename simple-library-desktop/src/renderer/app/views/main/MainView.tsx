import React from "react";
import {VBox} from "../../../newcomponents/layout/box/Box";
import {DynamicSlot} from "../../../newcomponents/base/slot/DynamicSlot";
import {Slot} from "../../../newcomponents/base/slot/Slot";
import {AppLayout} from "../../../newcomponents/misc/app/AppLayout";
import {AppToolbar} from "./apptoolbar/AppToolbar";
import {CollectionSidebar, TAB_DATA_COLLECTIONS} from "./sidebarmenu/CollectionSidebar";
import {NotificationStack} from "../../../newcomponents/modals/notification/NotificationStack";
import {Notification, NotificationProps} from "../../../newcomponents/modals/notification/Notification";
import {useNotifications} from "../../hooks/notificationHooks";
import {APP_ROOT_ID} from "../../application";
import {useGroups} from "../../hooks/groupHooks";
import {useMount} from "../../hooks/miscHooks";
import {ContentArea} from "./contentarea/ContentArea";

interface MainViewProps {
	onClosed: () => void
}

export function MainView(props: React.PropsWithChildren<MainViewProps>): React.ReactElement {

	const {
		getNotificationProps,
	} = useNotifications();

	const {
		loadGroups
	} = useGroups()

	useMount(() => loadGroups())

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

			<NotificationStack modalRootId={APP_ROOT_ID}>
				{getNotificationProps().map((n: NotificationProps) => <Notification {...n} />)}
			</NotificationStack>

		</>
	);
}
