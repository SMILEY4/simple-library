import {BaseProps, concatClasses, getIf} from "../../utils/common";
import React, {forwardRef, ReactElement, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./dateTimeInput.css";
import {TextField, TIME_INPUT_ACCEPT, TIME_INPUT_CHANGE} from "../textfield/TextField";
import {Button} from "../../buttons/button/Button";
import {HBox} from "../../layout/box/Box";
import {Icon, IconType} from "../../base/icon/Icon";
import {Label} from "../../base/label/Label";
import {LabelBox} from "../../base/labelbox/LabelBox";
import dateFormat from "dateformat";

export interface DateTimeInputProps extends BaseProps {
	value?: Date,
	disabled?: boolean,
	error?: boolean,
	groupPos?: "left" | "right" | "center",
	onAccept?: (value: Date) => void | Promise<void>,
	showTimeSelect?: boolean,
	toggleInputField?: boolean,
	labelFillWidth?: boolean
}

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

const DATE_FORMAT_PICKER = "yyyy-MM-dd HH:mm";
const DATE_FORMAT_LABEL = "yyyy-mm-dd HH:MM";

export function DateTimeInput(props: React.PropsWithChildren<DateTimeInputProps>): React.ReactElement {

	const initDateTime = props.value ? props.value : new Date();
	if (!props.showTimeSelect) {
		combineDateTime(initDateTime, [0, 0]);
	}

	const [value, setValue] = useState(initDateTime);
	const [open, setOpen] = useState(false);

	const CustomInput = forwardRef((inputProps: any, ref: any) => {
		if (!props.toggleInputField || open) {
			return (
				<LabelBox
					error={props.error}
					type={"body"}
					variant={"primary"}
					overflow={"cutoff"}
					groupPos={props.groupPos}
					forwardRef={ref}
				>
					{inputProps.value}
				</LabelBox>
			);
		} else {
			return (
				<div
					className={concatClasses(
						props.className,
						"toggle-text-field",
						"toggle-text-field-label",
						getIf(props.labelFillWidth, "toggle-text-field-fill")
					)}
					onClick={() => {
						inputProps.onClick;
						setOpen(true);
					}}
					onDoubleClick={(e: any) => e.stopPropagation()}
				>
					<Label overflow="cutoff">
						{dateFormat(value, DATE_FORMAT_LABEL)}
					</Label>
				</div>
			);
		}
	});

	const CustomTimeInput = () => (
		<TextField
			style={{marginRight: "var(-s-0-5)"}}
			value={toTimeString(getTime(value))}
			onAccept={handleOnChangeTime}
			regexChange={TIME_INPUT_CHANGE}
			regexAccept={TIME_INPUT_ACCEPT}
			maxlength={5}
			size={5}
		/>
	);

	return (
		<DatePicker
			calendarClassName={"datetimeinput-calendar with-shadow-1"}
			selected={value}
			open={open}
			dateFormat={DATE_FORMAT_PICKER}
			todayButton={"Today"}
			shouldCloseOnSelect={false}
			disabledKeyboardNavigation
			showTimeInput={props.showTimeSelect}
			onChange={handleOnChangeDate}
			onMonthChange={handleChangeMonth}
			onYearChange={handleChangeYear}
			onClickOutside={handleCancel}
			onKeyDown={handleKeyDown}
			customInput={<CustomInput/>}
			customTimeInput={<CustomTimeInput/>}
			renderCustomHeader={customHeader}
		>
			<Button className="datetimeinput-save-btn" variant="info" onAction={handleSave}>
				Save
			</Button>
		</DatePicker>
	);

	function customHeader(headerProps: any): ReactElement {
		return (
			<HBox spacing="0-15" style={{paddingLeft: "5px", paddingRight: "5px"}}>
				<Button square onAction={() => headerProps.changeYear(value.getFullYear() - 1)}><Icon type={IconType.CHEVRON_DOUBLE_LEFT}/></Button>
				<Button square onAction={headerProps.decreaseMonth}><Icon type={IconType.CHEVRON_LEFT}/></Button>
				<Label bold style={{
					paddingLeft: "var(--s-0-15)",
					paddingRight: "var(--s-0-15)",
					width: "100px",
					justifyContent: "center"
				}}>
					{MONTHS[headerProps.date.getMonth()] + " " + headerProps.date.getFullYear()}
				</Label>
				<Button square onAction={headerProps.increaseMonth}><Icon type={IconType.CHEVRON_RIGHT}/></Button>
				<Button square onAction={() => headerProps.changeYear(value.getFullYear() + 1)}><Icon type={IconType.CHEVRON_DOUBLE_RIGHT}/></Button>
			</HBox>
		);
	}

	function handleOnChangeDate(date: Date) {
		setValue(combineDateTime(date, getTime(value)));
	}

	function handleChangeMonth(date: Date) {
		setValue(combineDateMonthYear(value, date));
	}

	function handleChangeYear(date: Date) {
		setValue(combineDateYear(value, date));
	}

	function handleOnChangeTime(strTime: string) {
		const strParts = strTime.split(":");
		setValue(combineDateTime(value, [
			parseInt(strParts[0]),
			parseInt(strParts[1])
		]));
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
		if (event.key === "Escape") {
			event.stopPropagation();
			handleCancel();
		}
	}

	function handleSave() {
		const finalDate = props.showTimeSelect ? value : combineDateTime(value, [0, 0]);
		props.onAccept && props.onAccept(finalDate);
		setOpen(false);
	}

	function handleCancel() {
		setValue(initDateTime);
		setOpen(false);
	}

	function getTime(date: Date): [number, number] {
		return [date.getHours(), date.getMinutes()];
	}

	function toTimeString(time: [number, number]): string {
		return ""
			+ ((time[0] < 10) ? "0" + time[0] : time[0])
			+ ":"
			+ ((time[1] < 10) ? "0" + time[1] : time[1]);
	}

	function combineDateTime(date: Date, time: [number, number]): Date {
		const newDate = new Date(date);
		newDate.setHours(time[0], time[1], 0, 0);
		return newDate;
	}

	function combineDateMonthYear(date: Date, monthYear: Date): Date {
		const newDate = new Date(date);
		newDate.setMonth(monthYear.getMonth());
		newDate.setFullYear(monthYear.getFullYear());
		return newDate;
	}

	function combineDateYear(date: Date, year: Date): Date {
		const newDate = new Date(date);
		newDate.setFullYear(year.getFullYear());
		return newDate;
	}

}
