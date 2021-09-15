import {DialogFrame} from "../../components/modals/appdialogs/DialogFrame";
import React from "react";
import {useDialogEntries} from "../hooks/store/dialogState";

export function AppDialogFrame() {

	const dialogEntries = useDialogEntries();

	return <DialogFrame dialogEntries={dialogEntries}/>;
}
