import React from "react";
import {VBox} from "../../../newcomponents/layout/box/Box";
import {DynamicSlot} from "../../../newcomponents/base/slot/DynamicSlot";
import {Slot} from "../../../newcomponents/base/slot/Slot";
import {AppLayout} from "../../../newcomponents/misc/app/AppLayout";
import {MainToolbar} from "./MainToolbar";
import {requestCloseLibrary} from "../../common/messaging/messagingInterface";
import {CollectionSidebar, TAB_DATA_COLLECTIONS} from "./CollectionSidebar";
import {NotificationStack} from "../../../newcomponents/modals/notification/NotificationStack";
import {toNotificationEntry} from "../../common/utils/notificationUtils";
import {Notification} from "../../../newcomponents/modals/notification/Notification";
import {useNotifications} from "../../hooks/miscAppHooks";
import {Type} from "../../../components/common/common";

interface MainViewProps {
	onClose: () => void
}

export function MainView(props: React.PropsWithChildren<MainViewProps>): React.ReactElement {

	const {notifications, removeNotification} = useNotifications();

	return (
		<>
			<VBox fill>

				<MainToolbar
					onCloseLibrary={handleCloseLibrary}
					onImport={handleStartImport}
				/>

				<AppLayout tabsLeft={[TAB_DATA_COLLECTIONS]}>
					<DynamicSlot name="sidebar-left">
						{(tabId: string) => {
							if (tabId === TAB_DATA_COLLECTIONS.id) {
								return (<CollectionSidebar/>);
							} else {
								return null;
							}
						}}
					</DynamicSlot>
					<DynamicSlot name="sidebar-right">
						{(tabId: string) => null}
					</DynamicSlot>
					<Slot name={"main"}>
						Main Area
					</Slot>
				</AppLayout>

			</VBox>

			<NotificationStack modalRootId='root'>
				{notifications
					.map(notification => toNotificationEntry(notification, () => removeNotification(notification.id)))
					.map(notification => {
						return (
							<Notification
								type={convertNotificationType(notification.type)}
								icon={notification.icon}
								title={notification.title}
								caption={notification.caption}
								closable
								onClose={notification.onClose}
							>
								{notification.content}
							</Notification>
						);
					})}
			</NotificationStack>

		</>
	);

	function handleCloseLibrary(): void {
		requestCloseLibrary()
			.then(() => props.onClose())
	}

	function handleStartImport(): void {
		console.log("start import")
	}

	function convertNotificationType(type: Type): "info" | "success" | "warn" | "error" {
		switch (type) {
			case Type.DEFAULT:
				return "info"
			case Type.PRIMARY:
				return "info";
			case Type.SUCCESS:
				return "success";
			case Type.ERROR:
				return "error";
			case Type.WARN:
				return "warn";
		}
	}

}
