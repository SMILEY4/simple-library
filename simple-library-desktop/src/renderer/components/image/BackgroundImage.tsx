import * as React from "react";
import {ReactElement} from "react";
import "./backgroundImage.css"

interface BackgroundImageProps {
    url: string,
    posX?: string, // in %
    posY?: string, // in %
    offX?: number, // in px
    offY?: number, // in px
}


export function BackgroundImage(props: React.PropsWithChildren<BackgroundImageProps>): ReactElement {
    const styleBackgroundImage = {
        backgroundImage: "url(" + props.url + ")",
        backgroundPositionX: "calc(" + (props.posX ? props.posX : "50%") + " + " + (props.offX ? props.offX : "0px") + ")",
        backgroundPositionY: "calc(" + (props.posY ? props.posY : "50%") + " + " + (props.offY ? props.offY : "0px") + ")",
    };
    return (
        <div className="bg-image-component">
            <div className="bg-image-component-image" style={styleBackgroundImage}/>
            <div className="bg-image-component-overlay">
                {props.children}
            </div>
        </div>
    )
}
