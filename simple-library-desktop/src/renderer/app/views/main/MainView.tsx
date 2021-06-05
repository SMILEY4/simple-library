import React from "react";
import {VBox} from "../../../newcomponents/layout/box/Box";
import {DynamicSlot} from "../../../newcomponents/base/slot/DynamicSlot";
import {Slot} from "../../../newcomponents/base/slot/Slot";
import {AppLayout} from "../../../newcomponents/misc/app/AppLayout";
import {MainToolbar} from "./MainToolbar";
import {requestCloseLibrary} from "../../common/messaging/messagingInterface";
import {CollectionSidebar, TAB_DATA_COLLECTIONS} from "./sidebarmenu/CollectionSidebar";
import {NotificationStack} from "../../../newcomponents/modals/notification/NotificationStack";
import {toNotificationEntry} from "../../common/utils/notificationUtils";
import {Notification, NotificationProps} from "../../../newcomponents/modals/notification/Notification";
import {useNotificationsOld} from "../../hooks/old/miscAppHooks";
import {Type} from "../../../components/common/common";
import {useNotifications} from "../../hooks/notificationHooks";
import {useCloseLibrary} from "../../hooks/libraryHooks";
import {APP_ROOT_ID} from "../../application";

interface MainViewProps {
	onClose: () => void
}

export function MainView(props: React.PropsWithChildren<MainViewProps>): React.ReactElement {

	const {
		getNotificationProps,
	} = useNotifications();

	return (
		<>
			<VBox fill>

				<MainToolbar onCloseLibrary={props.onClose}/>

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
						Main Area
					</Slot>
				</AppLayout>

			</VBox>

			<NotificationStack modalRootId={APP_ROOT_ID}>
				{getNotificationProps().map((n: NotificationProps) => <Notification {...n} />)}
			</NotificationStack>

		</>
	);
}
