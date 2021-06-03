import React from "react";
import "./welcome.css"
import {Grid} from "../../../newcomponents/layout/grid/Grid";
import imgWelcome from "./imgWelcome.jpg";
import {Image} from "../../../newcomponents/base/image/Image";
import {VBox} from "../../../newcomponents/layout/box/Box";
import {Button} from "../../../newcomponents/buttons/button/Button";
import {Spacer} from "../../../newcomponents/base/spacer/Spacer";
import {Label} from "../../../newcomponents/base/label/Label";
import {AppNotification} from "../../store/state";
import {NotificationStack} from "../../../newcomponents/modals/notification/NotificationStack";
import {Notification} from "../../../newcomponents/modals/notification/Notification";
import {toNotificationEntry} from "../../common/utils/notificationUtils";
import {Type} from "../../../components/common/common";
import {RecentlyUsedEntry} from "./WelcomeViewController";


interface WelcomeViewProps {
	recentlyUsed: RecentlyUsedEntry[],
	notifications: AppNotification[],
	onCloseNotification: (id: string) => void,
	onCreate: () => void,
	onOpen: () => void,
}

export function WelcomeView(props: React.PropsWithChildren<WelcomeViewProps>): React.ReactElement {

	return (
		<div className="welcome">
			<Grid columns={['var(--s-12)', '1fr']} rows={['1fr']} fill>

				<VBox alignMain="center" alignCross="stretch" spacing="0-5" padding="0-5">

					<Label type="header-1" align="center">Simple Library</Label>

					<Spacer size="1" dir="horizontal"/>

					<Button onAction={props.onCreate}>New Library</Button>
					<Button onAction={props.onOpen}>Open Library</Button>

					<Spacer size="0-5" dir="horizontal" line/>

					<Label type="header-4" align="center">Recently Used</Label>
					{props.recentlyUsed.map((entry: RecentlyUsedEntry, index: number) =>
						<Button key={index} ghost onAction={entry.onAction}>{entry.name}</Button>
					)}
					{props.recentlyUsed.length === 0 && (
						<Label type="body" disabled align="center">Empty</Label>
					)}

				</VBox>

				<Image url={imgWelcome}/>

			</Grid>

			<NotificationStack modalRootId='root'>
				{props.notifications
					.map(notification => toNotificationEntry(notification, () => props.onCloseNotification(notification.id)))
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

		</div>
	);

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
