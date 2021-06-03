import React from "react";
import {BaseProps, concatClasses, Fill, map, orDefault} from "../../common/common";
import "./image.css"

export enum ImageMode {
    AUTO = "auto",
    COVER = "cover",
    CONTAIN = "contain",
}

export interface ImageProps  extends BaseProps {
    url: string,
    mode?: ImageMode
    posX?: string,
    posY?: string,
    color?: string,
}

export function Image(props: React.PropsWithChildren<ImageProps>): React.ReactElement {


    return (
        <div className={getClassNames(props)} style={{backgroundColor: props.color}} ref={props.forwardRef}>
            <div className="image-main" style={getStyle(props)}/>
            <div className="image-overlay">
                {props.children}
            </div>
        </div>
    );

    function getClassNames(props: ImageProps): string {
        return concatClasses(
            "image",
            orDefault(map(props.mode, (mode) => 'image-mode-' + mode), 'image-mode-cover'),
            props.className,
        )
    }

    function getStyle(props: ImageProps): any {
        return {
            ...props.style,
            backgroundImage: 'url(' + props.url + ')',
            backgroundPositionX: props.posX,
            backgroundPositionY: props.posY,
        };
    }
}
