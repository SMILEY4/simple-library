import React from "react";
import "./icon.css";
import { BaseProps, ColorType, concatClasses, getIf, map, Size } from "../../common/common";
import { AiFillHome, FaCheck, HiOutlineFolder } from 'react-icons/all';

export enum IconType {
    CHEVRON_UP,
    CHEVRON_DOWN,
    CHEVRON_LEFT,
    CHEVRON_RIGHT,
    CHEVRON_DOUBLE_UP,
    CHEVRON_DOUBLE_DOWN,
    CHEVRON_DOUBLE_LEFT,
    CHEVRON_DOUBLE_RIGHT,
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
    [IconType.FOLDER, SVG_OUTLINED],
    [IconType.HOME, SVG_FILLED],
    [IconType.CHECKMARK, SVG_FILLED],
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

    switch (props.type) {
        case IconType.FOLDER:
            return <HiOutlineFolder className={getClassName()} style={props.style}/>;
        case IconType.HOME:
            return <AiFillHome className={getClassName()} style={props.style}/>;
        case IconType.CHECKMARK:
            return <FaCheck className={getClassName()} style={props.style}/>;
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
