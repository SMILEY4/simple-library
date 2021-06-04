import React from "react";
import {DialogCreateLibrary} from "./DialogCreateLibrary";
import {useNotifications} from "../../hooks/notificationHooks";
import {LastOpenedLibrary, useCreateLibrary, useLastOpenedLibraries, useOpenLibrary} from "../../hooks/libraryHooks";
import {Grid} from "../../../newcomponents/layout/grid/Grid";
import {VBox} from "../../../newcomponents/layout/box/Box";
import {Label} from "../../../newcomponents/base/label/Label";
import {Spacer} from "../../../newcomponents/base/spacer/Spacer";
import {Button} from "../../../newcomponents/buttons/button/Button";
import {Image} from "../../../newcomponents/base/image/Image";
import imgWelcome from "./imgWelcome.jpg";
import {NotificationStack} from "../../../newcomponents/modals/notification/NotificationStack";
import {Notification, NotificationProps} from "../../../newcomponents/modals/notification/Notification";
import "./welcome.css"

interface WelcomeViewControllerProps {
	onLoadProject: () => void
}

export function WelcomeView(props: React.PropsWithChildren<WelcomeViewControllerProps>): React.ReactElement {

	const {
		getNotificationProps,
	} = useNotifications();

	const {
		showCreateLibraryDialog,
		startCreateLibrary,
		cancelCreateLibrary,
		createLibrary
	} = useCreateLibrary(props.onLoadProject)

	const {
		browseLibraries,
		openLibrary
	} = useOpenLibrary(props.onLoadProject)

	const {
		lastOpenedLibraries
	} = useLastOpenedLibraries(openLibrary);

	return (
		<>

			<div className="welcome">
				<Grid columns={['var(--s-12)', '1fr']} rows={['1fr']} fill>
					<VBox alignMain="center" alignCross="stretch" spacing="0-5" padding="0-5">
						<Label type="header-1" align="center">Simple Library</Label>
						<Spacer size="1" dir="horizontal"/>
						<Button onAction={startCreateLibrary}>New Library</Button>
						<Button onAction={browseLibraries}>Open Library</Button>
						<Spacer size="0-5" dir="horizontal" line/>
						<Label type="header-4" align="center">Recently Used</Label>
						{lastOpenedLibraries.map((entry: LastOpenedLibrary, index: number) =>
							<Button key={index} ghost onAction={entry.onAction}>{entry.name}</Button>
						)}
						{lastOpenedLibraries.length === 0 && (
							<Label type="body" disabled align="center">Empty</Label>
						)}
					</VBox>
					<Image url={imgWelcome}/>
				</Grid>
			</div>

			<NotificationStack modalRootId='root'>
				{getNotificationProps().map((n: NotificationProps) => <Notification {...n} />)}
			</NotificationStack>

			{showCreateLibraryDialog && (
				<DialogCreateLibrary
					onCancel={cancelCreateLibrary}
					onCreate={createLibrary}
				/>
			)}
		</>
	);

}
