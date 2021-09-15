import * as React from "react";
import {ReactElement} from "react";
import "./dialogFrame.css"
import {DialogEntry} from "../../../app/hooks/store/dialogState";


export interface DialogFrameProps {
	dialogEntries: DialogEntry[]
}

export function DialogFrame(props: React.PropsWithChildren<DialogFrameProps>) {

	return (
		<div className={"dialog-frame"}>
			{props.dialogEntries.map(renderEntry)}
		</div>
	);


	function renderEntry(entry: DialogEntry): ReactElement {
		return (
			<div key={entry.id}
				 className={"dialog-container with-shadow-2" + (entry.blockOutside ? " dialog-container-blocking" : "")}
			>
				{entry.content}
			</div>
		);
	}


}
