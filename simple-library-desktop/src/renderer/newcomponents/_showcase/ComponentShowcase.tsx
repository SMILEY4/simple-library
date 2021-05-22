import * as React from "react";
import {ReactElement, useState} from "react";
import {Theme} from "../../app/application";
import "./showcase.css"
import {ShowcaseSection} from "./ShowcaseSection";
import {BaseElementRaised} from "../base/element/BaseElementRaised";
import {BaseElementFlat} from "../base/element/BaseElementFlat";
import {BaseElementInset} from "../base/element/BaseElementInset";

interface ComponentShowcaseProps {
	theme: Theme,
	onChangeTheme: (theme: Theme) => void
}

export function ComponentShowcase(props: React.PropsWithChildren<ComponentShowcaseProps>): ReactElement {

	const [background, setBackground] = useState("2");

	return (
		<div className={"showcase theme-" + props.theme + " showcase-background-" + background}>

			<div className={"showcase-header"}>
				<div onClick={() => props.onChangeTheme(Theme.DARK)}>Dark</div>
				<div onClick={() => props.onChangeTheme(Theme.LIGHT)}>Light</div>
				<div onClick={() => setBackground("0")}>BG-0</div>
				<div onClick={() => setBackground("1")}>BG-1</div>
				<div onClick={() => setBackground("2")}>BG-2</div>
			</div>

			<ShowcaseSection title={"Element Colors"}>
				<div style={{display: "flex", gap: "5px"}}>
					{colorElement("--color-bg-raised", "--color-border")}
					{colorElement("--color-bg-raised-hover", "--color-border-hover")}
					{colorElement("--color-bg-raised-active", "--color-border-active")}
					{colorElement("--color-bg-raised-disabled", "--color-border-disabled")}
				</div>
				<div style={{display: "flex", gap: "5px"}}>
					{colorElement("--color-bg-primary", "--color-border-primary")}
					{colorElement("--color-bg-primary-hover", "--color-border-primary-hover")}
					{colorElement("--color-bg-primary-active", "--color-border-primary-active")}
					{colorElement("--color-bg-primary-disabled", "--color-border-primary-disabled")}
				</div>
				<div style={{display: "flex", gap: "5px"}}>
					{colorElement("--color-bg-success", "--color-border-success")}
					{colorElement("--color-bg-success-hover", "--color-border-success-hover")}
					{colorElement("--color-bg-success-active", "--color-border-success-active")}
					{colorElement("--color-bg-success-disabled", "--color-border-success-disabled")}
				</div>
				<div style={{display: "flex", gap: "5px"}}>
					{colorElement("--color-bg-warn", "--color-border-warn")}
					{colorElement("--color-bg-warn-hover", "--color-border-warn-hover")}
					{colorElement("--color-bg-warn-active", "--color-border-warn-active")}
					{colorElement("--color-bg-warn-disabled", "--color-border-warn-disabled")}
				</div>
				<div style={{display: "flex", gap: "5px"}}>
					{colorElement("--color-bg-error", "--color-border-error")}
					{colorElement("--color-bg-error-hover", "--color-border-error-hover")}
					{colorElement("--color-bg-error-active", "--color-border-error-active")}
					{colorElement("--color-bg-error-disabled", "--color-border-error-disabled")}
				</div>
			</ShowcaseSection>

			<ShowcaseSection title={"Element Base"}>
				<div style={{display: "flex", gap: "5px"}}>
					<BaseElementRaised style={{padding: "7px"}} interactive>Raised</BaseElementRaised>
					<BaseElementFlat style={{padding: "7px"}}>Flat</BaseElementFlat>
					<BaseElementInset style={{padding: "7px"}}>Inset</BaseElementInset>
				</div>
				<div style={{display: "flex", gap: "5px"}}>
					<BaseElementRaised style={{padding: "7px"}} interactive disabled>Raised Disabled</BaseElementRaised>
					<BaseElementInset style={{padding: "7px"}} disabled>Inset Disabled</BaseElementInset>
				</div>
				<h4 style={{color:"var(--color-text-primary)"}}>Variants of Raised</h4>
				<div style={{display: "flex", gap: "5px"}}>
					<BaseElementRaised style={{padding: "7px"}} variant="primary" interactive>Raised Primary</BaseElementRaised>
					<BaseElementRaised style={{padding: "7px"}} variant="primary" interactive disabled>Raised Primary Disabled</BaseElementRaised>
				</div>
				<div style={{display: "flex", gap: "5px"}}>
					<BaseElementRaised style={{padding: "7px"}} variant="success" interactive>Raised Success</BaseElementRaised>
					<BaseElementRaised style={{padding: "7px"}} variant="success" interactive disabled>Raised Success Disabled</BaseElementRaised>
				</div>
				<div style={{display: "flex", gap: "5px"}}>
					<BaseElementRaised style={{padding: "7px"}} variant="warn" interactive>Raised Warn</BaseElementRaised>
					<BaseElementRaised style={{padding: "7px"}} variant="warn" interactive disabled>Raised Warn Disabled</BaseElementRaised>
				</div>
				<div style={{display: "flex", gap: "5px"}}>
					<BaseElementRaised style={{padding: "7px"}} variant="error" interactive>Raised error</BaseElementRaised>
					<BaseElementRaised style={{padding: "7px"}} variant="error" interactive disabled>Raised error Disabled</BaseElementRaised>
				</div>
				<div style={{display: "flex", gap: "5px"}}>
					<BaseElementRaised style={{padding: "7px"}} error interactive>Raised Error State</BaseElementRaised>
					<BaseElementRaised style={{padding: "7px"}} error variant="primary" interactive>Raised Error State</BaseElementRaised>
					<BaseElementRaised style={{padding: "7px"}} error variant="success" interactive>Raised Error State</BaseElementRaised>
					<BaseElementRaised style={{padding: "7px"}} error variant="warn" interactive>Raised Error State</BaseElementRaised>
					<BaseElementFlat style={{padding: "7px"}} error >Flat Error State</BaseElementFlat>
					<BaseElementInset style={{padding: "7px"}} error>Inset Error State</BaseElementInset>

				</div>
			</ShowcaseSection>

		</div>
	);


	function colorElement(bg: string, border: string): ReactElement {
		return (
			<div style={{
				width: "20px",
				height: "20px",
				backgroundColor: "var(" + bg + ")",
				border: "1px solid var(" + border + ")",
				borderRadius: "5px"
			}}/>
		);
	}


}
