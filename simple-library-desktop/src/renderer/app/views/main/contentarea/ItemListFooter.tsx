import React from "react";
import "./itemListPagination.css";
import {HBox} from "../../../../components/layout/box/Box";
import {Button} from "../../../../components/buttons/button/Button";
import {Icon, IconType} from "../../../../components/base/icon/Icon";
import {ChoiceBox} from "../../../../components/buttons/choicebox/ChoiceBox";
import {Label} from "../../../../components/base/label/Label";
import {ArrayUtils} from "../../../../../common/arrayUtils";
import {IconButton} from "../../../../components/buttons/iconbutton/IconButton";
import {ItemFilterDTO} from "../../../../../common/events/dtoModels";
import {useDispatchCloseDialog, useDispatchOpenDialog} from "../../../hooks/store/dialogState";
import {DialogItemFilter} from "./itemfilter/DialogItemFilter";
import {DEFAULT_PAGE_SIZE} from "../../../hooks/store/collectionActiveState";

interface ItemListPaginationProps {
	itemCount: number,
	currentPage: number,
	pageSize: number,
	onGotoPage: (page: number) => void,
	onSetPageSize: (size: number) => void,
	view: "list" | "grid",
	onSetView: (view: "list" | "grid") => void,
	currentFilter: null | ItemFilterDTO
	onSetFilter: (filter: null | ItemFilterDTO) => void
}


export function ItemListFooter(props: React.PropsWithChildren<ItemListPaginationProps>): React.ReactElement {

	const openDialog = useDispatchOpenDialog();
	const closeDialog = useDispatchCloseDialog();

	const totalPageCount = Math.ceil(props.itemCount / props.pageSize);
	const isFirstPage = props.currentPage === 0;
	const isLastPage = (props.currentPage + 1) === totalPageCount;

	const CB_ITEMS = ArrayUtils.unique([10, 50, 100, 250, 500, 1000, DEFAULT_PAGE_SIZE])
		.sort((a, b) => a - b)
		.map(s => ({id: ("" + s), text: s + " Items"}));

	return (
		<HBox alignMain="center" alignCross="center" className="item-list-pagination">

			<Button onAction={() => props.onGotoPage(0)} disabled={isFirstPage}>
				<Icon type={IconType.CHEVRON_DOUBLE_LEFT}/>
				First
			</Button>
			<Button onAction={() => props.onGotoPage(props.currentPage - 1)} disabled={isFirstPage}>
				<Icon type={IconType.CHEVRON_LEFT}/>
				Prev
			</Button>

			<div className="item-list-pagination-current-page">
				{"Page " + (props.currentPage + 1) + " of " + totalPageCount}
			</div>

			<Button onAction={() => props.onGotoPage(props.currentPage + 1)} disabled={isLastPage}>
				Next
				<Icon type={IconType.CHEVRON_RIGHT}/>
			</Button>
			<Button onAction={() => props.onGotoPage(totalPageCount - 1)} disabled={isLastPage}>
				Last
				<Icon type={IconType.CHEVRON_DOUBLE_RIGHT}/>
			</Button>

			<HBox spacing="0-25" style={{marginLeft: "auto"}}>
				<Label>Show on Page:</Label>
				<ChoiceBox
					items={CB_ITEMS}
					selectedItemId={("" + props.pageSize)}
					onAction={(itemId: string) => props.onSetPageSize(Number.parseInt(itemId))}
				/>
			</HBox>

			<HBox alignCross="stretch">
				<IconButton icon={IconType.LIST} groupPos="left" onAction={() => props.onSetView("list")}/>
				<IconButton icon={IconType.GRID} groupPos="right" onAction={() => props.onSetView("grid")}/>
			</HBox>

			<IconButton icon={IconType.FILTER} variant={props.currentFilter ? "info" : undefined} onAction={openFilterDialog}/>

		</HBox>
	);

	function openFilterDialog() {
		openDialog(id => ({
			blockOutside: true,
			content: <DialogItemFilter
				initFilter={props.currentFilter}
				onClose={() => closeDialog(id)}
				onApply={(filter: null | ItemFilterDTO) => {
					closeDialog(id);
					if (filter !== props.currentFilter) {
						props.onSetFilter(filter);
					}
				}}
			/>
		}));
	}

}
