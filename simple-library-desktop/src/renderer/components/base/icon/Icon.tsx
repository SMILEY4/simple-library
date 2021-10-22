import React from "react";
import "./icon.css";
import {
    AiFillCaretRight,
    AiFillHome,
    AiOutlineFileText,
    AiOutlineFolder,
    AiOutlineSearch,
    AiOutlineTags,
    BiExport,
    BiImages,
    BiImport,
    BiPlus,
    BsChevronDoubleLeft,
    BsChevronDoubleRight,
    BsChevronDown,
    BsChevronLeft,
    BsChevronRight,
    BsChevronUp,
    FaCheck,
    FaFileExport,
    FaFileImport,
    FiSettings,
    VscClose
} from "react-icons/all";
import {BaseProps, concatClasses, getIf, map, Size} from "../../utils/common";
import {BiImagesSmart} from "./BiImagesSmart";
import {IconBaseProps} from "react-icons/lib/cjs/iconBase";

export enum IconType {
    PLUS,
    CHEVRON_UP,
    CHEVRON_DOWN,
    CHEVRON_LEFT,
    CHEVRON_RIGHT,
    // CHEVRON_DOUBLE_UP,
    // CHEVRON_DOUBLE_DOWN,
    CHEVRON_DOUBLE_LEFT,
    CHEVRON_DOUBLE_RIGHT,
    CARET_RIGHT,
    // PLUS,
    // MINUS,
    // CROSS,
    CLOSE,
    SEARCH,
    // REFRESH,
    IMPORT,
    EXPORT,
    HOME,
    SETTINGS,
    CHECKMARK,
    // DIRECTORY,
    FILE,
    // IMAGES,
    FOLDER,
    COLLECTION,
    COLLECTIONS_SMART,
    TAGS,
    FILE_IMPORT,
    FILE_EXPORT
}


const SVG_OUTLINED = "outlined";
const SVG_FILLED = "filled";


const ICON_COLOR_TYPE = new Map<IconType, string>([
    [IconType.PLUS, SVG_FILLED],
    [IconType.CLOSE, SVG_FILLED],
    [IconType.FOLDER, SVG_FILLED],
    [IconType.FILE, SVG_OUTLINED],
    [IconType.HOME, SVG_FILLED],
    [IconType.CHECKMARK, SVG_FILLED],
    [IconType.CARET_RIGHT, SVG_FILLED],
    [IconType.IMPORT, SVG_FILLED],
    [IconType.EXPORT, SVG_FILLED],
    [IconType.SEARCH, SVG_OUTLINED],
    [IconType.SETTINGS, SVG_OUTLINED],

    [IconType.CHEVRON_UP, SVG_FILLED],
    [IconType.CHEVRON_DOWN, SVG_FILLED],
    [IconType.CHEVRON_LEFT, SVG_FILLED],
    [IconType.CHEVRON_RIGHT, SVG_FILLED],
    [IconType.CHEVRON_DOUBLE_LEFT, SVG_FILLED],
    [IconType.CHEVRON_DOUBLE_RIGHT, SVG_FILLED],

    [IconType.COLLECTION, SVG_FILLED],
    [IconType.COLLECTIONS_SMART, SVG_FILLED],
    [IconType.TAGS, SVG_OUTLINED],

    [IconType.FILE_IMPORT, SVG_FILLED],
    [IconType.FILE_EXPORT, SVG_FILLED]

]);

export interface IconProps extends BaseProps {
    type: IconType,
    size?: Size,
    color?: "primary" | "secondary" | "info" | "success" | "error" | "warn" | "on-variant"
    disabled?: boolean,
    onClick?: () => void,
}

export function Icon(props: React.PropsWithChildren<IconProps>): React.ReactElement {

    const iconProps: IconBaseProps = {
        className: getClassName(),
        style: props.style,
        onClick: props.onClick
    };
    switch (props.type) {
        case IconType.PLUS:
            return <BiPlus {...iconProps}/>;
        case IconType.CLOSE:
            return <VscClose {...iconProps} />;
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
        case IconType.CHEVRON_DOUBLE_LEFT:
            return <BsChevronDoubleLeft {...iconProps} />;
        case IconType.CHEVRON_DOUBLE_RIGHT:
            return <BsChevronDoubleRight {...iconProps} />;
        case IconType.FILE:
            return <AiOutlineFileText {...iconProps} />;
        case IconType.FOLDER:
            return <AiOutlineFolder {...iconProps} />;
        case IconType.IMPORT:
            return <BiImport {...iconProps} />;
        case IconType.EXPORT:
            return <BiExport {...iconProps} />;
        case IconType.COLLECTION:
            return <BiImages {...iconProps} />;
        case IconType.COLLECTIONS_SMART:
            return <BiImagesSmart {...iconProps} />;
        case IconType.SETTINGS:
            return <FiSettings {...iconProps} />;
        case IconType.SEARCH:
            return <AiOutlineSearch {...iconProps} />;
        case IconType.TAGS:
            return <AiOutlineTags {...iconProps} />;
        case IconType.FILE_IMPORT:
            return <FaFileImport {...iconProps}/>;
        case IconType.FILE_EXPORT:
            return <FaFileExport {...iconProps}/>;
        default:
            return null;
    }

    function getClassName(): string {
        const isFilled = ICON_COLOR_TYPE.get(props.type) === SVG_FILLED;
        const isOutlined = ICON_COLOR_TYPE.get(props.type) === SVG_OUTLINED;
        const color: string = props.color ? props.color : "primary";
        return concatClasses(
            props.className,
            "icon",
            getIf(isOutlined, "icon-color-outline-" + color),
            getIf(isFilled, "icon-color-fill-" + color),
            getIf(props.disabled, "icon-disabled"),
            map(props.size, size => "icon-size-" + size)
        );
    }

}
