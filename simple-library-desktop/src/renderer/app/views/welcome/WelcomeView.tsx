import React from "react";
import {DialogCreateLibrary} from "./DialogCreateLibrary";
import {useNotifications} from "../../hooks/base/notificationHooks";
import {LastOpenedLibrary, useLastOpenedLibraries} from "../../hooks/base/libraryHooks";
import {Grid} from "../../../components/layout/grid/Grid";
import {VBox} from "../../../components/layout/box/Box";
import {Label} from "../../../components/base/label/Label";
import {Spacer} from "../../../components/base/spacer/Spacer";
import {Button} from "../../../components/buttons/button/Button";
import {Image} from "../../../components/base/image/Image";
import imgWelcome from "./imgWelcome.jpg";
import {NotificationStack} from "../../../components/modals/notification/NotificationStack";
import {Notification, NotificationProps} from "../../../components/modals/notification/Notification";
import "./welcome.css"
import {APP_ROOT_ID} from "../../Application";
import {useWelcome} from "../../hooks/app/useWelcome";

interface WelcomeViewControllerProps {
	onLoadProject: () => void
}

export function WelcomeView(props: React.PropsWithChildren<WelcomeViewControllerProps>): React.ReactElement {

	const {
		getNotificationStackEntries,
	} = useNotifications();

	const {
		showDialogCreateLibrary,
		openCreateLibrary,
		cancelCreateLibrary,
		createLibrary,
		browseLibrary,
		openLibrary
	} = useWelcome()

	const {
		lastOpenedLibraries
	} = useLastOpenedLibraries(handleOpenLastUsed);

	return (
		<>

			<div className="welcome">
				<Grid columns={['var(--s-12)', '1fr']} rows={['1fr']} fill>
					<VBox alignMain="center" alignCross="stretch" spacing="0-5" padding="0-5">
						<Label type="header-1" align="center">Simple Library</Label>
						<Spacer size="1" dir="horizontal"/>
						<Button onAction={openCreateLibrary}>New Library</Button>
						<Button onAction={handleOpenLibrary}>Open Library</Button>
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

			<NotificationStack
				modalRootId={APP_ROOT_ID}
				entries={getNotificationStackEntries()}
			/>

			{showDialogCreateLibrary && (
				<DialogCreateLibrary
					onCancel={cancelCreateLibrary}
					onCreate={handleCreateLibrary}
				/>
			)}
		</>
	);

	function handleCreateLibrary(name: string, targetDir: string) {
		createLibrary(name, targetDir)
			.then(() => props.onLoadProject())
	}

	function handleOpenLibrary() {
		browseLibrary()
			.then(filepath => filepath !== null && props.onLoadProject())
	}

	function handleOpenLastUsed(filepath: string) {
		openLibrary(filepath)
			.then(() => props.onLoadProject())
	}

}
