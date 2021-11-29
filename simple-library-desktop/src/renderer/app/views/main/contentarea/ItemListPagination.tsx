import React from "react";
import "./listItemEntry.css";
import "./itemListPagination.css";
import {HBox} from "../../../../components/layout/box/Box";
import {Button} from "../../../../components/buttons/button/Button";
import {Icon, IconType} from "../../../../components/base/icon/Icon";

interface ItemListPaginationProps {
	itemCount: number,
	currentPage: number,
	pageSize: number,
	onGotoPage: (page: number) => void
}

export function ItemListPagination(props: React.PropsWithChildren<ItemListPaginationProps>): React.ReactElement {

	const totalPageCount = Math.ceil(props.itemCount / props.pageSize);
	const isFirstPage = props.currentPage === 0;
	const isLastPage = (props.currentPage + 1) === totalPageCount;

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

		</HBox>
	);


}
