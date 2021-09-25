import {BaseProps, concatClasses, getIf} from "../../utils/common";
import React, {useState} from "react";
import {Label} from "../../base/label/Label";
import {ListInputCard} from "./ListInputCard";
import {useDispatchCloseDialog, useDispatchOpenDialog} from "../../../app/hooks/store/dialogState";

interface ListInputFieldProps extends BaseProps {
	listName: string,
	initItems: string[]
	enforceUnique?: boolean,
	fillWidth?: boolean,
	onSave?: (items: string[]) => void
}

export function ListInputField(props: React.PropsWithChildren<ListInputFieldProps>): React.ReactElement {

	const openDialog = useDispatchOpenDialog();
	const closeDialog = useDispatchCloseDialog();

	const [items, setItems] = useState(props.initItems ? props.initItems : []);

	return <div
		className={concatClasses(
			props.className,
			"toggle-text-field",
			"toggle-text-field-label",
			getIf(props.fillWidth, "toggle-text-field-fill")
		)}
		onClick={handleClickLabel}
		onDoubleClick={(e: any) => e.stopPropagation()}
	>
		<Label overflow="cutoff">
			{items.join(", ")}
		</Label>
	</div>;

	function handleClickLabel() {
		openDialog(id => ({
			blockOutside: true,
			content: <ListInputCard
				listName={props.listName}
				initItems={items}
				enforceUnique
				nVisibleItems={10}
				onCancel={() => closeDialog(id)}
				onSave={items => {
					setItems(items);
					closeDialog(id);
					props.onSave && props.onSave(items);
				}}
			/>
		}));
	}

}
