import React from "react";
import {concatClasses, Fill, map, orDefault} from "../common";
import "./image.css"

export enum ImageMode {
    AUTO = "auto",
    COVER = "cover",
    CONTAIN = "contain",
}

export interface ImageProps {
    url: string,
    mode?: ImageMode
    fill?: Fill,
    posX?: string, // in %
    posY?: string, // in %
    offX?: number, // in px
    offY?: number, // in px
    color?: string,
    className?: string,
}

type ImageReactProps = React.PropsWithChildren<ImageProps>;

export function Image(props: ImageReactProps): React.ReactElement {

    function getClassNames(props: ImageProps): string {
        return concatClasses(
            "image",
            orDefault(map(props.mode, (mode) => 'image-mode-' + mode), 'image-mode-cover'),
            map(props.fill, (fill) => "fill" + fill),
            props.className,
        )
    }


    function getStyle(props: ImageProps): any {
        return {
            backgroundImage: 'url(' + props.url + ')',
            backgroundPositionX: 'calc(' + (props.posX ? props.posX : '50%') + ' + ' + (props.offX ? props.offX : '0px') + ')',
            backgroundPositionY: 'calc(' + (props.posY ? props.posY : '50%') + ' + ' + (props.offY ? props.offY : '0px') + ')',
        };
    }

    return (
        <div className={getClassNames(props)} style={{backgroundColor: props.color}}>
            <div className="image-main" style={getStyle(props)}/>
            <div className="image-overlay">
                {props.children}
            </div>
        </div>
    );
}
