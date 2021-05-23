import * as React from "react";
import {ReactElement, useState} from "react";
import {Theme} from "../../app/application";
import "./showcase.css"
import {ShowcaseSection} from "./ShowcaseSection";
import {BaseElementRaised} from "../base/element/BaseElementRaised";
import {BaseElementFlat} from "../base/element/BaseElementFlat";
import {BaseElementInset} from "../base/element/BaseElementInset";
import {Icon, IconType} from "../base/icon/Icon";
import {Label} from "../base/label/Label";
import {LabelBox} from "../base/labelbox/LabelBox";
import {Button} from "../buttons/button/Button";
import {CheckBox} from "../buttons/checkbox/CheckBox";
import {Box, HBox, VBox} from "../layout/box/Box";

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

			{renderBox()}
			{renderCheckBox()}
			{renderButtons()}
			{renderLabelBox()}
			{renderLabels()}
			{renderIcons()}
			{renderElementBase()}

		</div>
	);


	function renderBox() {
		return <ShowcaseSection title={"Box"}>

			<div style={{display: "flex", gap: "20px"}}>
				<BaseElementFlat>
					<VBox spacing="0-5">
						{dummyElement(40, 20)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</VBox>
				</BaseElementFlat>
				<BaseElementFlat>
					<VBox alignCross="start" spacing="0-5">
						{dummyElement(40, 20)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</VBox>
				</BaseElementFlat>
				<BaseElementFlat>
					<VBox alignCross="end" spacing="0-5">
						{dummyElement(40, 20)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</VBox>
				</BaseElementFlat>
				<BaseElementFlat>
					<VBox alignCross="stretch" spacing="0-5">
						{dummyElement(40, 20)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</VBox>
				</BaseElementFlat>
			</div>

			<div style={{display: "flex", gap: "20px"}}>
				<BaseElementFlat>
					<HBox spacing="0-5">
						{dummyElement(40, 20)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</HBox>
				</BaseElementFlat>
				<BaseElementFlat>
					<HBox alignCross="start" spacing="0-5">
						{dummyElement(40, 20)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</HBox>
				</BaseElementFlat>
				<BaseElementFlat>
					<HBox alignCross="end" spacing="0-5">
						{dummyElement(40, 20)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</HBox>
				</BaseElementFlat>
				<BaseElementFlat>
					<HBox alignCross="stretch" spacing="0-5">
						{dummyElement(40, 14)}
						{dummyElement(25, 20)}
						{dummyElement(30, 40)}
						{dummyElement(55, 25)}
					</HBox>
				</BaseElementFlat>
			</div>


		</ShowcaseSection>
	}


	function renderCheckBox() {
		return <ShowcaseSection title={"CheckBox"}>

			<div style={{display: "flex", gap: "20px"}}>
				<CheckBox>Checkbox</CheckBox>
				<CheckBox disabled>Checkbox</CheckBox>
			</div>

			<div style={{display: "flex", gap: "20px"}}>
				<CheckBox selected>Checkbox</CheckBox>
				<CheckBox selected disabled>Checkbox</CheckBox>
			</div>

			<div style={{display: "flex", gap: "20px"}}>
				<CheckBox variant="info">Checkbox</CheckBox>
				<CheckBox variant="info" disabled>Checkbox</CheckBox>
			</div>

			<div style={{display: "flex", gap: "20px"}}>
				<CheckBox variant="info" selected>Checkbox</CheckBox>
				<CheckBox variant="info" selected disabled>Checkbox</CheckBox>
			</div>

			<div style={{display: "flex", gap: "20px"}}>
				<CheckBox forceState>Forced Checkbox</CheckBox>
				<CheckBox forceState selected>Forced Checkbox</CheckBox>
			</div>

		</ShowcaseSection>
	}


	function renderButtons() {
		return <ShowcaseSection title={"Buttons"}>

			<div style={{display: "flex", gap: "20px"}}>
				<Button onAction={() => console.log("click")}>
					Button
				</Button>
				<Button onAction={() => console.log("click")}>
					<Icon type={IconType.HOME}/>
					Button with icon
				</Button>
				<Button variant="info" onAction={() => console.log("click")}>
					<Icon type={IconType.HOME}/>
					Info Button
				</Button>
				<Button square onAction={() => console.log("click")}>
					<Icon type={IconType.HOME}/>
				</Button>
				<Button error onAction={() => console.log("click")}>
					Invalid
				</Button>
				<Button disabled onAction={() => console.log("click")}>
					Disabled
				</Button>
			</div>

			<div style={{display: "flex", gap: "20px"}}>
				<Button><Icon type={IconType.HOME}/>Default</Button>
				<Button variant="info"><Icon type={IconType.HOME}/>Info</Button>
				<Button variant="success"><Icon type={IconType.HOME}/>Success</Button>
				<Button variant="warn"><Icon type={IconType.HOME}/>Warn</Button>
				<Button variant="error"><Icon type={IconType.HOME}/>Error</Button>
			</div>
			<div style={{display: "flex", gap: "20px"}}>
				<Button disabled><Icon type={IconType.HOME}/>Default</Button>
				<Button disabled variant="info"><Icon type={IconType.HOME}/>Info</Button>
				<Button disabled variant="success"><Icon type={IconType.HOME}/>Success</Button>
				<Button disabled variant="warn"><Icon type={IconType.HOME}/>Warn</Button>
				<Button disabled variant="error"><Icon type={IconType.HOME}/>Error</Button>
			</div>

		</ShowcaseSection>
	}


	function renderLabelBox() {
		return <ShowcaseSection title={"LabelBox"}>
			<LabelBox>
				<Icon type={IconType.HOME}/>
				Label Box
			</LabelBox>
			<LabelBox disabled>
				<Icon type={IconType.HOME}/>
				Disabled Label Box
			</LabelBox>
			<LabelBox error>
				<Icon type={IconType.HOME}/>
				Invalid Label Box
			</LabelBox>
		</ShowcaseSection>
	}


	function renderLabels() {
		return <ShowcaseSection title={"Labels"}>
			<div style={{display: "flex", gap: "20px"}}>
				<Label>
					Label without Icon
				</Label>
				<Label>
					<Icon type={IconType.HOME}/>
					Label with 2 Icons
					<Icon type={IconType.HOME}/>
				</Label>
				<Label noSelect>
					<Icon type={IconType.HOME}/>
					Label not selectable
				</Label>
			</div>
			<div style={{display: "flex", gap: "20px"}}>
				<Label variant="primary"><Icon type={IconType.HOME}/>Primary</Label>
				<Label variant="secondary"><Icon type={IconType.HOME}/>Secondary</Label>
				<Label variant="info"><Icon type={IconType.HOME}/>Info</Label>
				<Label variant="success"><Icon type={IconType.HOME}/>Success</Label>
				<Label variant="warn"><Icon type={IconType.HOME}/>Warn</Label>
				<Label variant="error"><Icon type={IconType.HOME}/>Error</Label>
				<BaseElementRaised style={{padding: "4px"}} variant="info" interactive>
					<Label variant="on-variant"><Icon type={IconType.HOME}/>On Variant</Label>
				</BaseElementRaised>
			</div>
			<div style={{display: "flex", gap: "20px"}}>
				<Label disabled variant="primary"><Icon type={IconType.HOME}/>Primary</Label>
				<Label disabled variant="secondary"><Icon type={IconType.HOME}/>Secondary</Label>
				<Label disabled variant="info"><Icon type={IconType.HOME}/>Info</Label>
				<Label disabled variant="success"><Icon type={IconType.HOME}/>Success</Label>
				<Label disabled variant="warn"><Icon type={IconType.HOME}/>Warn</Label>
				<Label disabled variant="error"><Icon type={IconType.HOME}/>Error</Label>
				<BaseElementRaised style={{padding: "4px"}} variant="info" disabled>
					<Label variant="on-variant" disabled><Icon type={IconType.HOME}/>On Variant</Label>
				</BaseElementRaised>
			</div>

			<Label type="header-1"><Icon type={IconType.HOME}/>Header 1</Label>
			<Label type="header-2"><Icon type={IconType.HOME}/>Header 2</Label>
			<Label type="header-3"><Icon type={IconType.HOME}/>Header 3</Label>
			<Label type="header-4"><Icon type={IconType.HOME}/>Header 4</Label>
			<div style={{display: "flex", gap: "20px"}}>
				<Label type="body"><Icon type={IconType.HOME}/>Body</Label>
				<Label italic type="body"><Icon type={IconType.HOME}/>Body</Label>
			</div>
			<div style={{display: "flex", gap: "20px"}}>
				<Label type="caption"><Icon type={IconType.HOME}/>Caption</Label>
				<Label italic type="caption"><Icon type={IconType.HOME}/>Caption</Label>
			</div>

			<BaseElementFlat style={{padding: "4px", maxWidth: "80px"}}>
				<Label overflow="wrap"><Icon type={IconType.HOME}/>Default i.e. wrap long text</Label>
			</BaseElementFlat>

			<BaseElementFlat style={{padding: "4px", maxWidth: "80px"}}>
				<Label overflow="nowrap"><Icon type={IconType.HOME}/>Dont wrap long text</Label>
			</BaseElementFlat>

			<BaseElementFlat style={{padding: "4px", maxWidth: "80px"}}>
				<Label overflow="nowrap-hidden"><Icon type={IconType.HOME}/>Dont wrap long text, hide
					overflow</Label>
			</BaseElementFlat>

			<BaseElementFlat style={{padding: "4px", maxWidth: "80px"}}>
				<Label overflow="cutoff"><Icon type={IconType.HOME}/>Dont wrap long text, cut off overflow</Label>
			</BaseElementFlat>

		</ShowcaseSection>
	}


	function renderIcons() {
		return <ShowcaseSection title={"Icons"}>
			<div style={{display: "flex", gap: "5px"}}>
				<Icon type={IconType.HOME} color="primary"/>
				<Icon type={IconType.HOME} color="secondary"/>
				<Icon type={IconType.HOME} color="info"/>
				<Icon type={IconType.HOME} color="success"/>
				<Icon type={IconType.HOME} color="warn"/>
				<Icon type={IconType.HOME} color="error"/>
				<BaseElementRaised style={{padding: "4px"}} variant="info" interactive>
					<Icon type={IconType.HOME} color="on-variant"/>
				</BaseElementRaised>
			</div>
			<div style={{display: "flex", gap: "5px"}}>
				<Icon type={IconType.HOME} disabled color="primary"/>
				<Icon type={IconType.HOME} disabled color="secondary"/>
				<Icon type={IconType.HOME} disabled color="info"/>
				<Icon type={IconType.HOME} disabled color="success"/>
				<Icon type={IconType.HOME} disabled color="warn"/>
				<Icon type={IconType.HOME} disabled color="error"/>
				<BaseElementRaised style={{padding: "4px"}} variant="info" interactive disabled>
					<Icon type={IconType.HOME} disabled color="on-variant"/>
				</BaseElementRaised>
			</div>
			<div style={{display: "flex", gap: "5px"}}>
				<Icon type={IconType.HOME} size="0-25"/>
				<Icon type={IconType.HOME} size="0-5"/>
				<Icon type={IconType.HOME} size="0-75"/>
				<Icon type={IconType.HOME} size="1"/>
				<Icon type={IconType.HOME} size="1-5"/>
				<Icon type={IconType.HOME} size="2"/>
				<Icon type={IconType.HOME} size="3"/>
			</div>
		</ShowcaseSection>
	}


	function renderElementBase() {
		return <ShowcaseSection title={"Element Base"}>
			<div style={{display: "flex", gap: "5px"}}>
				<BaseElementRaised style={{padding: "7px"}} interactive>Raised</BaseElementRaised>
				<BaseElementFlat style={{padding: "7px"}}>Flat</BaseElementFlat>
				<BaseElementInset style={{padding: "7px"}}>Inset</BaseElementInset>
			</div>
			<div style={{display: "flex", gap: "5px"}}>
				<BaseElementRaised style={{padding: "7px"}} interactive disabled>Raised Disabled</BaseElementRaised>
				<BaseElementInset style={{padding: "7px"}} disabled>Inset Disabled</BaseElementInset>
			</div>
			<h4 style={{color: "var(--color-text-primary)"}}>Variants of Raised</h4>
			<div style={{display: "flex", gap: "5px"}}>
				<BaseElementRaised style={{padding: "7px"}} variant="info" interactive>Raised
					Primary</BaseElementRaised>
				<BaseElementRaised style={{padding: "7px"}} variant="info" interactive disabled>Raised Primary
					Disabled</BaseElementRaised>
			</div>
			<div style={{display: "flex", gap: "5px"}}>
				<BaseElementRaised style={{padding: "7px"}} variant="success" interactive>Raised
					Success</BaseElementRaised>
				<BaseElementRaised style={{padding: "7px"}} variant="success" interactive disabled>Raised Success
					Disabled</BaseElementRaised>
			</div>
			<div style={{display: "flex", gap: "5px"}}>
				<BaseElementRaised style={{padding: "7px"}} variant="warn" interactive>Raised
					Warn</BaseElementRaised>
				<BaseElementRaised style={{padding: "7px"}} variant="warn" interactive disabled>Raised Warn
					Disabled</BaseElementRaised>
			</div>
			<div style={{display: "flex", gap: "5px"}}>
				<BaseElementRaised style={{padding: "7px"}} variant="error" interactive>Raised
					error</BaseElementRaised>
				<BaseElementRaised style={{padding: "7px"}} variant="error" interactive disabled>Raised error
					Disabled</BaseElementRaised>
			</div>
			<div style={{display: "flex", gap: "5px"}}>
				<BaseElementRaised style={{padding: "7px"}} error interactive>Raised Error State</BaseElementRaised>
				<BaseElementRaised style={{padding: "7px"}} error variant="info" interactive>Raised Error
					State</BaseElementRaised>
				<BaseElementRaised style={{padding: "7px"}} error variant="success" interactive>Raised Error
					State</BaseElementRaised>
				<BaseElementRaised style={{padding: "7px"}} error variant="warn" interactive>Raised Error
					State</BaseElementRaised>
				<BaseElementFlat style={{padding: "7px"}} error>Flat Error State</BaseElementFlat>
				<BaseElementInset style={{padding: "7px"}} error>Inset Error State</BaseElementInset>
			</div>

			<div style={{display: "flex"}}>
				<BaseElementRaised interactive groupPos="left" style={{padding: "7px"}}>Left</BaseElementRaised>
				<BaseElementRaised interactive groupPos="center" style={{padding: "7px"}}>Center</BaseElementRaised>
				<BaseElementRaised interactive groupPos="center" style={{padding: "7px"}}>Center</BaseElementRaised>
				<BaseElementRaised interactive groupPos="right" style={{padding: "7px"}}>Right</BaseElementRaised>
			</div>

		</ShowcaseSection>
	}


	function dummyElement(width: number, height: number): ReactElement {
		return (
			<div style={{
				minWidth: width+"px",
				minHeight:  height+"px",
				backgroundColor: "gray",
			}}/>
		);
	}

}
