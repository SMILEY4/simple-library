import React from "react";
import {DialogCreateLibrary} from "./DialogCreateLibrary";
import {useNotificationsState} from "../../hooks/base/notificationHooks";
import {Grid} from "../../../components/layout/grid/Grid";
import {VBox} from "../../../components/layout/box/Box";
import {Label} from "../../../components/base/label/Label";
import {Spacer} from "../../../components/base/spacer/Spacer";
import {Button} from "../../../components/buttons/button/Button";
import {Image} from "../../../components/base/image/Image";
import imgWelcome from "./imgWelcome.jpg";
import {NotificationStack} from "../../../components/modals/notification/NotificationStack";
import "./welcome.css";
import {APP_ROOT_ID} from "../../Application";
import {useDialogCreateLibraryController} from "./useDialogCreateLibrary";
import {useDialogErrorExiftoolLocationController} from "./useDialogErrorExiftoolLocation";
import {DialogErrorExiftoolLocation} from "./DialogErrorExiftoolLocation";
import {LastOpenedLibrary, useWelcomeView} from "./welcomeViewHooks";

interface WelcomeViewControllerProps {
	onLoadProject: () => void
}

export function WelcomeView(props: React.PropsWithChildren<WelcomeViewControllerProps>): React.ReactElement {

	const {
		getNotificationStackEntries
	} = useNotificationsState();

	const {
		lastOpenedLibraries,
		browseLibraryAndOpen,
	} = useWelcomeView(props.onLoadProject);

	const [
		showCreateLibrary,
		openCreateLibrary,
		closeCreateLibrary
	] = useDialogCreateLibraryController();

	const showErrorExiftool = useDialogErrorExiftoolLocationController();

	return (
		<>
			<div className="welcome">
				<Grid columns={["var(--s-12)", "1fr"]} rows={["1fr"]} fill>
					<VBox alignMain="center" alignCross="stretch" spacing="0-5" padding="0-5">

						<Label type="header-1" align="center">Simple Library</Label>
						<Spacer size="1" dir="horizontal"/>

						<Button onAction={openCreateLibrary}>New Library</Button>
						<Button onAction={browseLibraryAndOpen}>Open Library</Button>

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

			{showCreateLibrary && (
				<DialogCreateLibrary onFinished={handleFinishCreatedLibrary}/>
			)}
			{showErrorExiftool && (
				<DialogErrorExiftoolLocation/>
			)}
		</>
	);

	function handleFinishCreatedLibrary(created: boolean) {
		closeCreateLibrary();
		if (created) {
			props.onLoadProject();
		}
	}

}
