import React, {useState} from "react";
import {HBox, VBox} from "../../../../../components/layout/box/Box";
import {Label} from "../../../../../components/base/label/Label";
import {IconButton} from "../../../../../components/buttons/iconbutton/IconButton";
import {IconType} from "../../../../../components/base/icon/Icon";
import {AttributeKeyDTO, AttributeMetaDTO} from "../../../../../../common/events/dtoModels";
import "./panelCustomAttributes.css"
import {TextField} from "../../../../../components/input/textfield/TextField";
import {Button} from "../../../../../components/buttons/button/Button";
import {ArrayUtils} from "../../../../../../common/arrayUtils";

interface PanelCustomAttributesProps {
}


export function PanelCustomAttributes(props: React.PropsWithChildren<PanelCustomAttributesProps>): React.ReactElement {

	const [customAttributes, setCustomAttributes] = useState<AttributeMetaDTO[]>([]);
	const [formData, setFormData] = useState<AttributeKeyDTO>({
		id: "",
		name: "",
		g0: "Custom",
		g1: "Custom",
		g2: "Custom",
	});

	return (
		<HBox spacing="0-5" alignMain="space-between" alignCross="start" className="custom-attributes-base">
			<VBox spacing="0-5" alignMain="start" alignCross="stretch" padding="0-25"
				  className="custom-attributes-form">
				<VBox spacing="0-15" alignMain="start" alignCross="stretch">
					<Label type="caption">Name</Label>
					<TextField
						placeholder={"Name"}
						value={formData.name}
						onAccept={onFormSetName}
						onChange={onFormSetName}
						forceState
					/>
				</VBox>
				<VBox spacing="0-15" alignMain="start" alignCross="stretch">
					<Label type="caption">Group 0</Label>
					<TextField
						placeholder={"Group 0"}
						value={formData.g0}
						onAccept={onFormSetG0}
						onChange={onFormSetG0}
						forceState
					/>
				</VBox>
				<VBox spacing="0-15" alignMain="start" alignCross="stretch">
					<Label type="caption">Group 1</Label>
					<TextField
						placeholder={"Group 1"}
						value={formData.g1}
						onAccept={onFormSetG1}
						onChange={onFormSetG1}
						forceState
					/>
				</VBox>
				<VBox spacing="0-15" alignMain="start" alignCross="stretch">
					<Label type="caption">Group 2</Label>
					<TextField
						placeholder={"Group 2"}
						value={formData.g2}
						onAccept={onFormSetG2}
						onChange={onFormSetG2}
						forceState
					/>
				</VBox>
				<Button onAction={onCreateCustomAttribute}>Create</Button>
			</VBox>
			<VBox spacing="0-25" alignMain="start" alignCross="stretch" padding="0-25"
				  className="custom-attributes-list">
				{customAttributes.map(e => {
					return (
						<HBox spacing="0-25" padding="0-25" alignMain="space-between" alignCross="center" key={e.attId}
							  className="attrib-entry">
							<VBox alignCross="start" alignMain="center">
								<Label overflow="cutoff">
									{e.key.name}
								</Label>
								<Label type="caption" variant="secondary" overflow="cutoff">
									{e.key.g0 + ", " + e.key.g1 + ", " + e.key.g2}
								</Label>
							</VBox>
							<IconButton ghost icon={IconType.CLOSE} onAction={() => onDeleteCustomAttribute(e)}/>
						</HBox>
					);
				})}
			</VBox>
		</HBox>
	);


	function onFormSetName(value: string) {
		setFormData({
			...formData,
			name: value,
			id: value
		})
	}

	function onFormSetG0(value: string) {
		setFormData({
			...formData,
			g0: value
		})
	}

	function onFormSetG1(value: string) {
		setFormData({
			...formData,
			g1: value
		})
	}

	function onFormSetG2(value: string) {
		setFormData({
			...formData,
			g2: value
		})
	}

	function onCreateCustomAttribute() {
		if (isFormDataValid()) {
			if (!keyExists(formData)) {
				setCustomAttributes([
					...customAttributes,
					{
						attId: null,
						key: {
							id: formData.id.trim(),
							name: formData.name.trim(),
							g0: (formData.g0 && formData.g0.trim().length > 0) ? formData.g0.trim() : "Custom",
							g1: (formData.g1 && formData.g1.trim().length > 0) ? formData.g1.trim() : "Custom",
							g2: (formData.g2 && formData.g2.trim().length > 0) ? formData.g2.trim() : "Custom",
						},
						type: "?",
						writable: true,
					}
				]);
			}
			clearFormData();
		}
	}


	function onDeleteCustomAttribute(entry: AttributeMetaDTO) {
		setCustomAttributes(ArrayUtils.remove(customAttributes, entry, attributeMetaEquals))
	}


	function clearFormData() {
		setFormData({
			id: "",
			name: "",
			g0: "Custom",
			g1: "Custom",
			g2: "Custom",
		})
	}


	function isFormDataValid() {
		return formData.name.trim().length > 0;
	}


	function keyExists(key: AttributeKeyDTO) {
		return ArrayUtils.contains(customAttributes, key, (a, b) => {
			const keyA = a.key;
			return keyA.id === b.id
				&& keyA.name === b.name
				&& keyA.g0 === b.g0
				&& keyA.g1 === b.g1
				&& keyA.g2 === b.g2;
		});
	}


	function attributeMetaEquals(b: AttributeMetaDTO, a: AttributeMetaDTO) {
		if (a.attId === null || a.attId === undefined || b.attId === null || b.attId === undefined) {
			const keyA = a.key;
			const keyB = b.key;
			return keyA.id === keyB.id
				&& keyA.name === keyB.name
				&& keyA.g0 === keyB.g0
				&& keyA.g1 === keyB.g1
				&& keyA.g2 === keyB.g2;
		} else {
			return a.attId === b.attId;
		}
	}

}
