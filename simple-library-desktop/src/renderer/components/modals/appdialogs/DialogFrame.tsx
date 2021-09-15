import * as React from "react";
import {ReactElement} from "react";
import "./dialogFrame.css"
import {DialogEntry} from "../../../app/hooks/store/dialogState";
import {useKeyListener} from "../../utils/commonHooks";


export interface DialogFrameProps {
	dialogEntries: DialogEntry[]
}

export function DialogFrame(props: React.PropsWithChildren<DialogFrameProps>) {

	useKeyListener("Escape", (event: KeyboardEvent) => {
		// @ts-ignore
		if (props.onEscape && event.target.tagName === "BODY") {
			event.preventDefault();
			onEscape();
		}
	})

	useKeyListener("Enter", (event: KeyboardEvent) => {
		// @ts-ignore
		if (props.onEnter && event.target.tagName === "BODY") {
			event.preventDefault();
			onEnter();
		}
	})

	return (
		<div className={"dialog-frame"}>
			{props.dialogEntries.map(renderEntry)}
		</div>
	);


	function renderEntry(entry: DialogEntry): ReactElement {

		console.log("RENDER ENTRY", entry.content, entry.content.props.children)

		return (
			<div key={entry.id}
				 className={"dialog-container with-shadow-2" + (entry.blockOutside ? " dialog-container-blocking" : "")}>
				{entry.content}
			</div>
		);
	}

	function onEscape() {
		if (props.dialogEntries.length > 0) {
			const dialogOnEscape = props.dialogEntries[props.dialogEntries.length - 1].content.props.onEscape;
			if (dialogOnEscape) {
				dialogOnEscape();
			}
		}
	}

	function onEnter() {
		if (props.dialogEntries.length > 0) {
			const dialogOnEnter = props.dialogEntries[props.dialogEntries.length - 1].content.props.onEnter;
			if (dialogOnEnter) {
				dialogOnEnter();
			}
		}
	}

}
