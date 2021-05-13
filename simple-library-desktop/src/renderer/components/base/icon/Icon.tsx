import React from "react";
import "./icon.css";
import { BaseProps, ColorType, concatClasses, getIf, map, Size } from "../../common/common";
import {
    AiFillCaretRight,
    AiFillHome,
    BsChevronDown,
    BsChevronLeft,
    BsChevronRight,
    BsChevronUp,
    FaCheck,
    HiOutlineFolder,
} from 'react-icons/all';
import {CgClose} from "react-icons/cg";

export enum IconType {
    CHEVRON_UP,
    CHEVRON_DOWN,
    CHEVRON_LEFT,
    CHEVRON_RIGHT,
    CHEVRON_DOUBLE_UP,
    CHEVRON_DOUBLE_DOWN,
    CHEVRON_DOUBLE_LEFT,
    CHEVRON_DOUBLE_RIGHT,
    CARET_RIGHT,
    PLUS,
    MINUS,
    CROSS,
    CLOSE,
    REFRESH,
    IMPORT,
    HOME,
    CHECKMARK,
    DIRECTORY,
    FILE,
    IMAGES,
    FOLDER,
}


const SVG_OUTLINED = "outlined";
const SVG_FILLED = "filled";


const ICON_COLOR_TYPE = new Map<IconType, string>([
    [IconType.CLOSE, SVG_FILLED],
    [IconType.FOLDER, SVG_OUTLINED],
    [IconType.HOME, SVG_FILLED],
    [IconType.CHECKMARK, SVG_FILLED],
    [IconType.CARET_RIGHT, SVG_FILLED],

    [IconType.CHEVRON_UP, SVG_FILLED],
    [IconType.CHEVRON_DOWN, SVG_FILLED],
    [IconType.CHEVRON_LEFT, SVG_FILLED],
    [IconType.CHEVRON_RIGHT, SVG_FILLED],

]);

export interface IconProps extends BaseProps {
    type: IconType,
    color?: ColorType,
    size?: Size,
}

/**
 * Displays and handles an svg icon with a given color and size.
 */
export function Icon(props: React.PropsWithChildren<IconProps>): React.ReactElement {

    const iconProps: any = {
        className: getClassName(),
        style: props.style,
    };
    switch (props.type) {
        case IconType.CLOSE:
            return <CgClose {...iconProps} />;
        case IconType.FOLDER:
            return <HiOutlineFolder {...iconProps} />;
        case IconType.HOME:
            return <AiFillHome {...iconProps} />;
        case IconType.CHECKMARK:
            return <FaCheck {...iconProps} />;
        case IconType.CARET_RIGHT:
            return <AiFillCaretRight {...iconProps} />;
        case IconType.CHEVRON_UP:
            return <BsChevronUp {...iconProps} />;
        case IconType.CHEVRON_DOWN:
            return <BsChevronDown {...iconProps} />;
        case IconType.CHEVRON_LEFT:
            return <BsChevronLeft {...iconProps} />;
        case IconType.CHEVRON_RIGHT:
            return <BsChevronRight {...iconProps} />;
        default:
            return null;
    }

    function getClassName(): string {
        const isFilled = ICON_COLOR_TYPE.get(props.type) === SVG_FILLED;
        const isOutlined = ICON_COLOR_TYPE.get(props.type) === SVG_OUTLINED;
        return concatClasses(
            "icon",
            map(props.size, size => "icon-size-" + size),
            getIf(isOutlined, map(props.color, color => "icon-color-outline-" + color)),
            getIf(isFilled, map(props.color, color => "icon-color-fill-" + color)),
            props.className,
        );
    }

}