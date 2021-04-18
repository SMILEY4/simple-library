import React from "react";
import "./icon.css"
import {ColorType, concatClasses, getIf, map, Size} from "../common";
import {AiFillHome, HiOutlineFolder} from 'react-icons/all';

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

const OUTLINED = "outlined";
const FILLED = "filled";


const ICON_COLOR_TYPE = new Map<IconType, string>([
    [IconType.FOLDER, OUTLINED],
    [IconType.HOME, FILLED]
]);

export interface IconProps {
    type: IconType,
    color?: ColorType,
    size?: Size,
    className?: string
}

export function Icon(props: React.PropsWithChildren<IconProps>): React.ReactElement {
    switch (props.type) {
        case IconType.FOLDER:
            return <HiOutlineFolder className={getClassName()}/>;
        case IconType.HOME:
            return <AiFillHome className={getClassName()}/>;
        default:
            return null;
    }

    function getClassName(): string {
        const isFilled = ICON_COLOR_TYPE.get(props.type) === FILLED
        const isOutlined = ICON_COLOR_TYPE.get(props.type) === OUTLINED
        return concatClasses(
            "icon",
            map(props.size, size => "icon-size-" + size),
            getIf(isOutlined, map(props.color, color => "icon-color-outline-" + color)),
            getIf(isFilled, map(props.color, color => "icon-color-fill-" + color)),
            props.className,
        )
    }

}
