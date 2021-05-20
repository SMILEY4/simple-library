import * as React from "react";
import {ReactElement, useState} from "react";
import {Theme} from "../../app/application";
import "./showcase.css"
import {ShowcaseSection} from "./ShowcaseSection";
import {ElementBase} from "../base/elementbase/ElementBase";

interface ComponentShowcaseProps {
    theme: Theme,
    onChangeTheme: (theme: Theme) => void
}

export function ComponentShowcase(props: React.PropsWithChildren<ComponentShowcaseProps>): ReactElement {

    const [background, setBackground] = useState("2");

    return (
        <div className={"showcase theme-" + props.theme + " showcase-background-" + background}>

            <div className={"showcase-header"}>
                <div onClick={() => props.onChangeTheme(Theme.DARK)}>Dark</div>
                <div onClick={() => props.onChangeTheme(Theme.LIGHT)}>Light</div>
                <div onClick={() => setBackground("0")}>BG-0</div>
                <div onClick={() => setBackground("1")}>BG-1</div>
                <div onClick={() => setBackground("2")}>BG-2</div>
            </div>

            <ShowcaseSection title={"Element Colors"}>
                <div style={{display: "flex", gap: "5px"}}>
                    {colorElement("--color-bg", "--color-border")}
                    {colorElement("--color-bg-hover", "--color-border-hover")}
                    {colorElement("--color-bg-active", "--color-border-active")}
                    {colorElement("--color-bg-disabled", "--color-border-disabled")}
                </div>
                <div style={{display: "flex", gap: "5px"}}>
                    {colorElement("--color-bg-primary", "--color-border-primary")}
                    {colorElement("--color-bg-primary-hover", "--color-border-primary-hover")}
                    {colorElement("--color-bg-primary-active", "--color-border-primary-active")}
                    {colorElement("--color-bg-primary-disabled", "--color-border-primary-disabled")}
                </div>
                <div style={{display: "flex", gap: "5px"}}>
                    {colorElement("--color-bg-success", "--color-border-success")}
                    {colorElement("--color-bg-success-hover", "--color-border-success-hover")}
                    {colorElement("--color-bg-success-active", "--color-border-success-active")}
                    {colorElement("--color-bg-success-disabled", "--color-border-success-disabled")}
                </div>
                <div style={{display: "flex", gap: "5px"}}>
                    {colorElement("--color-bg-warn", "--color-border-warn")}
                    {colorElement("--color-bg-warn-hover", "--color-border-warn-hover")}
                    {colorElement("--color-bg-warn-active", "--color-border-warn-active")}
                    {colorElement("--color-bg-warn-disabled", "--color-border-warn-disabled")}
                </div>
                <div style={{display: "flex", gap: "5px"}}>
                    {colorElement("--color-bg-error", "--color-border-error")}
                    {colorElement("--color-bg-error-hover", "--color-border-error-hover")}
                    {colorElement("--color-bg-error-active", "--color-border-error-active")}
                    {colorElement("--color-bg-error-disabled", "--color-border-error-disabled")}
                </div>
            </ShowcaseSection>

            <ShowcaseSection title={"Element Base"}>
                <div style={{display: "flex", gap: "5px"}}>
                    <ElementBase className={"showcase-tile"} interactive/>
                    <ElementBase className={"showcase-tile"} type={"primary"} interactive/>
                    <ElementBase className={"showcase-tile"} type={"success"} interactive/>
                    <ElementBase className={"showcase-tile"} type={"warn"} interactive/>
                    <ElementBase className={"showcase-tile"} type={"error"} interactive/>
                </div>
                <div style={{display: "flex", gap: "5px"}}>
                    <ElementBase className={"showcase-tile"} outline/>
                    <ElementBase className={"showcase-tile"} outline type={"primary"}/>
                    <ElementBase className={"showcase-tile"} outline type={"success"}/>
                    <ElementBase className={"showcase-tile"} outline type={"warn"}/>
                    <ElementBase className={"showcase-tile"} outline type={"error"}/>
                </div>
                <div style={{display: "flex", gap: "5px"}}>
                    <ElementBase className={"showcase-tile"} interactive error/>
                    <ElementBase className={"showcase-tile"} interactive error type={"primary"}/>
                    <ElementBase className={"showcase-tile"} interactive error type={"success"}/>
                    <ElementBase className={"showcase-tile"} interactive error type={"warn"}/>
                    <ElementBase className={"showcase-tile"} interactive error type={"error"}/>
                </div>
            </ShowcaseSection>

        </div>
    );


    function colorElement(bg: string, border: string): ReactElement {
        return (
            <div style={{
                width: "20px",
                height: "20px",
                backgroundColor: "var(" + bg + ")",
                border: "1px solid var(" + border + ")",
                borderRadius: "5px"
            }}/>
        );
    }


}
