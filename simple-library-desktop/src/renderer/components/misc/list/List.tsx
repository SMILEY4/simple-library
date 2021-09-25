import {BaseProps, concatClasses} from "../../utils/common";
import React from "react";
import "./list.css";
import {Label} from "../../base/label/Label";
import {BaseElementFlat} from "../../base/element/BaseElementFlat";
import {HBox} from "../../layout/box/Box";
import {Icon, IconType} from "../../base/icon/Icon";

interface ListProps extends BaseProps {
	items: string[];
	nVisibleItems?: number;
	onRemove?: (item: string, index: number) => void;
}

export function List(props: React.PropsWithChildren<ListProps>): React.ReactElement {

	return (
		<BaseElementFlat
			className={concatClasses(props.className, "list-container")}
			style={{height: "calc(" + props.nVisibleItems + " * var(--s-1))"}}
			forwardRef={props.forwardRef}
		>
			{props.items.map((item, index) => {
				return (
					<HBox className={"list-item " + ((index % 2 === 0) ? "list-item-even" : "list-item-uneven")} alignMain="start" spacing={"0-25"}>
						<Icon className={"list-item-remove"}
							  type={IconType.CLOSE}
							  size="1"
							  onClick={() => props.onRemove && props.onRemove(item, index)}
						/>
							<Label overflow="nowrap-hidden" className={"list-item-label"}>
								{item}
							</Label>
					</HBox>
				);
			})}
		</BaseElementFlat>
	);
}
