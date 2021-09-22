import {BaseProps} from "../../utils/common";
import React from "react";
import {Card} from "../../layout/card/Card";
import {Slot} from "../../base/slot/Slot";
import {HBox, VBox} from "../../layout/box/Box";
import {Button} from "../../buttons/button/Button";
import {TextField, TFAcceptCause} from "../textfield/TextField";
import {Icon, IconType} from "../../base/icon/Icon";
import {List} from "../../misc/list/List";
import {Label} from "../../base/label/Label";

interface ListInputCardProps extends BaseProps {
	listName: string,
	onCancel?: () => void
}

export function ListInputCard(props: React.PropsWithChildren<ListInputCardProps>): React.ReactElement {

	return (
		<Card
			title={"Edit '" + props.listName + "'"}
			onClose={handleCancel}
			closable
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="0-5">
					<HBox>
						<TextField
							groupPos="left"
							style={{flexGrow: 1}}
							onAccept={(value: string, cause: TFAcceptCause) => cause === "enter" && handleOnAddItem(value)}
						/>
						<Button
							groupPos="right"
							square
							onAction={handleOnAddItemCurrent}
						>
							<Icon type={IconType.PLUS}/>
						</Button>
					</HBox>
					<List
						items={"Ancient;Architecture;Bell Tower;Blue;Buildint Exterior;Campanile;Clear Sky;Close-Up;Copy Space;Day;Famous Place;History;Horizontal;International Landmark;Italian Culture;National Landmark;No People;Outdoors;Renaissance;Sunny;Symbol;Tourism;Tower;Town;Travel;Travel Destinations;UNESCO;UNESCO World Heritage Site;Veneto;Venice".split(";")}
						nVisibleItems={5}
						onRemove={handleOnRemove}
					/>
					<Label
						type="caption"
						variant="secondary"
						style={{alignSelf: "flex-end"}}
					>
						42 Items
					</Label>
				</VBox>
			</Slot>
			<Slot name={"footer"}>
				<Button onAction={handleCancel}>Cancel</Button>
				<Button onAction={handleSave} variant="info">Save</Button>
			</Slot>
		</Card>
	);


	function handleOnAddItemCurrent() {
	}


	function handleOnAddItem(item: string) {
	}


	function handleOnRemove(item: string, index: number) {
	}


	function handleCancel() {
	}


	function handleSave() {
	}

}
