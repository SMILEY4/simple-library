import React from "react";
import "./image.css"
import {BaseProps} from "../../common";
import {concatClasses, mapOrDefault} from "../../../components/common/common";

export interface ImageProps extends BaseProps {
    url: string,
    mode?: "auto" | "cover" | "contain"
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
            props.className,
            "image",
            mapOrDefault(props.mode, "cover", mode => "image-mode-" + mode),
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
