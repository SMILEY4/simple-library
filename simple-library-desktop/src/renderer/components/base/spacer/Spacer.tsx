import React, {CSSProperties} from "react";
import {BaseProps, Size} from "../../utils/common";
import {concatClasses, getIf, map} from "../../utils/common";
import "./spacer.css"

interface SpacerProps extends BaseProps {
	size: Size | "max",
	dir: "vertical" | "horizontal",
	line?: boolean
}

export function Spacer(props: React.PropsWithChildren<SpacerProps>): React.ReactElement {

	const styleVertical: CSSProperties = {
		marginLeft: props.size === "max" ? "auto" : "calc( var(--s-" + props.size + ") / 2 )",
		marginRight: "calc( var(--s-" + props.size + ") / 2 )"
	}

	const styleHorizontal: CSSProperties = {
		marginTop: props.size === "max" ? "auto" : "calc( var(--s-" + props.size + ") / 2 )",
		marginBottom: "calc( var(--s-" + props.size + ") / 2 )"
	}

	return (
		<div
			className={concatClasses(
				props.className,
				map(props.dir, dir => "spacer-" + dir),
				map(props.size, size => "spacer-" + size),
				getIf(props.line, "spacer-line")
			)}
			style={{
				...(props.dir === "vertical" ? styleVertical : styleHorizontal),
				...props.style
			}}
			ref={props.forwardRef}
		/>
	);

}
