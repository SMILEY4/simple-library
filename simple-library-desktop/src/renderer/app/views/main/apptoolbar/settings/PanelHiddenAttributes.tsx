import React, {useEffect, useState} from "react";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import {Label} from "../../../../../components/base/label/Label";
import {IconButton} from "../../../../../components/buttons/iconbutton/IconButton";
import {IconType} from "../../../../../components/base/icon/Icon";
import "./panelHiddenAttributes.css";
import {fetchAllAttributeMeta} from "../../../../common/eventInterface";
import {AttributeMetaDTO} from "../../../../../../common/events/dtoModels";
import {TextField} from "../../../../../components/input/textfield/TextField";


interface PanelHiddenAttributes {
	hiddenAttributes: AttributeMetaDTO[],
	onSetHiddenAttributes: (attribs: AttributeMetaDTO[]) => void
}

export function PanelHiddenAttributes(props: React.PropsWithChildren<PanelHiddenAttributes>): React.ReactElement {

	const [search, setSearch] = useState("");
	const [attributeMeta, setAttributeMeta] = useState<AttributeMetaDTO[]>([]);

	useEffect(() => {
		if (search && search.trim().length >= 3) {
			fetchAllAttributeMeta(search).then(setAttributeMeta);
		} else {
			setAttributeMeta([]);
		}
	}, [search]);

	return (
		<HBox spacing="0-5" alignMain="space-between" alignCross="start" className="hidden-attribs-base">
			<VBox spacing="0-25" alignMain="start" alignCross="stretch">
				<TextField
					placeholder={"Search"}
					value={search}
					onAccept={value => {
						console.log("value", value);
						setSearch(value.toLowerCase());
					}}
				/>
				<VBox spacing="0-25" alignMain="start" alignCross="stretch" padding="0-25" className="hidden-attribs-available">
					{attributeMeta.filter(e => e.name.toLowerCase().includes(search)).map(e => {
						return (
							<HBox spacing="0-25" alignMain="space-between" alignCross="center" key={e.g0 + "." + e.g1 + "." + e.g2 + "." + e.id + "." + e.name} className="attrib-entry">
								<VBox alignCross="start" alignMain="center">
									<Label overflow="cutoff">
										{e.name}
									</Label>
									<Label type="caption" variant="secondary" overflow="cutoff">
										{e.g0 + ", " + e.g1 + ", " + e.g2}
									</Label>
								</VBox>
								<IconButton ghost icon={IconType.CARET_RIGHT} onAction={() => hideField(e)}/>
							</HBox>

						);
					})}
					{attributeMeta.length === 0 && (
						<Label>Search Something</Label>
					)}
				</VBox>
			</VBox>
			<VBox spacing="0-25" alignMain="start" alignCross="stretch" padding="0-25" className="hidden-attribs-selected">
				{props.hiddenAttributes.map(e => {
					return (
						<HBox spacing="0-25" alignMain="space-between" alignCross="center" key={e.g0 + "." + e.g1 + "." + e.g2 + "." + e.id + "." + e.name} className="attrib-entry">
							<VBox alignCross="start" alignMain="center">
								<Label overflow="cutoff">
									{e.name}
								</Label>
								<Label type="caption" variant="secondary" overflow="cutoff">
									{e.g0 + ", " + e.g1 + ", " + e.g2}
								</Label>
							</VBox>
							<IconButton ghost icon={IconType.CLOSE} onAction={() => showField(e)}/>
						</HBox>
					);
				})}
			</VBox>
		</HBox>
	);

	function hideField(attrib: AttributeMetaDTO) {
		const next = props.hiddenAttributes.filter(e => !areEqual(e, attrib));
		if (next.length === props.hiddenAttributes.length) {
			props.onSetHiddenAttributes([...next, attrib].sort((a, b) => a.name.localeCompare(b.name)));
		}
	}

	function showField(attrib: AttributeMetaDTO) {
		const next = props.hiddenAttributes.filter(e => !areEqual(e, attrib));
		if (next.length !== props.hiddenAttributes.length) {
			props.onSetHiddenAttributes(next);
		}
	}

	function areEqual(a: AttributeMetaDTO, b: AttributeMetaDTO): boolean {
		return (a.id === b.id) && (a.g0 === b.g0) && (a.g1 === b.g1) && (a.g2 === b.g2) && (a.name === b.name);
	}

}
