import * as React from "react";
import {ReactElement, useState} from "react";
import "./showcase.css"

interface ShowcaseSectionProps {
    title: string
}

export function ShowcaseSection(props: React.PropsWithChildren<ShowcaseSectionProps>): ReactElement {

    const [expanded, setExpanded] = useState(false)

    return (
        <div className={"showcase-section"}>
            <div className={"showcase-section-title"} onClick={() => setExpanded(!expanded)}>
                {props.title}
            </div>
            {expanded && (
                <div className={"showcase-section-content"}>
                    {props.children}
                </div>
            )}
        </div>
    );

}
