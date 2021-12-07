import React from "react";
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
import {DialogErrorExiftoolLocation} from "./DialogErrorExiftoolLocation";
import {LastOpenedLibrary} from "../../hooks/core/librariesGetLastOpened";
import {useWelcomeView} from "./useWelcomeView";
import {useGetNotificationStackEntries} from "../../hooks/store/notificationState";
import {useDispatchCloseDialog, useDispatchOpenDialog} from "../../hooks/store/dialogState";
import {DialogCreateLibrary} from "./DialogCreateLibrary";
import {useExiftoolMissingError} from "./useExiftoolMissingError";

interface WelcomeViewControllerProps {
	onLoadProject: () => void;
}

export function WelcomeView(props: React.PropsWithChildren<WelcomeViewControllerProps>): React.ReactElement {

	const getNotificationStackEntries = useGetNotificationStackEntries();
	const openDialog = useDispatchOpenDialog();
	const closeDialog = useDispatchCloseDialog();

	const {
		lastOpenedLibraries,
		browseLibraryAndOpen
	} = useWelcomeView(props.onLoadProject);

	const showErrorExiftool = useExiftoolMissingError();
	if (showErrorExiftool) {
		openDialogExiftoolMissing();
	}

	return (
		<>
			<div className="welcome">
				<Grid columns={["var(--s-12)", "1fr"]} rows={["1fr"]} fill>
					<VBox alignMain="center" alignCross="stretch" spacing="0-5" padding="0-5">

						<Label type="header-1" align="center">Simple Library</Label>
						<Spacer size="1" dir="horizontal"/>

						<Button onAction={openDialogCreateLibrary}>New Library</Button>
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

		</>
	);

	function openDialogExiftoolMissing() {
		openDialog(id => ({
			blockOutside: true,
			content: <DialogErrorExiftoolLocation/>
		}));
	}

	function openDialogCreateLibrary() {
		openDialog(id => ({
			blockOutside: true,
			content: <DialogCreateLibrary onFinished={(created: boolean) => handleFinishCreatedLibrary(id, created)}/>
		}));
	}

	function handleFinishCreatedLibrary(dialogId: string, created: boolean) {
		closeDialog(dialogId);
		if (created) {
			props.onLoadProject();
		}
	}

}
