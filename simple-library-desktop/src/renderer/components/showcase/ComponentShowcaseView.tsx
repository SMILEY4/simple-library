import * as React from 'react';
import {useState} from 'react';
import "./showcase.css"
import {Button, ButtonFilled, ButtonGhost, ButtonText} from "_renderer/components/Buttons";
import {HighlightType, StyleType} from "_renderer/components/Common";
import {AiFillCaretRight, AiFillHome} from "react-icons/all";

export function ComponentShowcaseView(): any {
    const [theme, setTheme] = useState("light-0")
    const themeName = (theme === "light-0" || theme === "light-1") ? "light" : "dark"
    const backgroundNumber = (theme === "light-0" || theme === "dark-0") ? "0" : "1"
    return (
        <div className={
            "showcase-view"
            + " theme-" + themeName
            + " background-" + backgroundNumber
        }>
            <div className="showcase-controls">
                <div onClick={() => setTheme("light-0")}>Light-0</div>
                <div onClick={() => setTheme("light-1")}>Light-1</div>
                <div onClick={() => setTheme("dark-0")}>Dark-0</div>
                <div onClick={() => setTheme("dark-1")}>Dark-1</div>
            </div>
            <div className="showcase-content">
                {renderContent()}
            </div>
        </div>
    )

    function renderContent() {
        return (
            <>
                <h3>Buttons</h3>

                <h5>Styles</h5>
                <ShowcaseRow>
                    <ButtonFilled highlight={HighlightType.NONE}>Filled</ButtonFilled>
                    <ButtonGhost highlight={HighlightType.NONE} bg={backgroundNumber}>Ghost</ButtonGhost>
                    <ButtonText highlight={HighlightType.NONE}>Text</ButtonText>
                </ShowcaseRow>


                <h5>Filled</h5>
                <ShowcaseRow>
                    <ButtonFilled highlight={HighlightType.NONE} >Button None</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.INFO} >Button Info</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.SUCCESS}>Button Success</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.ERROR}>Button Error</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.WARN}>Button Warn</ButtonFilled>
                </ShowcaseRow>
                <ShowcaseRow>
                    <ButtonFilled highlight={HighlightType.NONE}>Enabled</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.NONE}>
                        <AiFillHome/>
                        With Icons
                        <AiFillCaretRight/>
                    </ButtonFilled>
                    <ButtonFilled highlight={HighlightType.NONE} disabled={true}>Disabled</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.NONE} small={true}>Small</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.NONE} small={true}>
                        <AiFillHome/>
                        Small with Icons
                        <AiFillCaretRight/>
                    </ButtonFilled>
                </ShowcaseRow>

                <h5>Ghost</h5>
                <ShowcaseRow>
                    <ButtonGhost highlight={HighlightType.NONE} bg={backgroundNumber}>Button
                        None
                    </ButtonGhost>
                    <ButtonGhost highlight={HighlightType.INFO} bg={backgroundNumber}>Button
                        Info
                    </ButtonGhost>
                    <ButtonGhost highlight={HighlightType.SUCCESS} bg={backgroundNumber}>Button
                        Success
                    </ButtonGhost>
                    <ButtonGhost highlight={HighlightType.ERROR} bg={backgroundNumber}>Button
                        Error
                    </ButtonGhost>
                    <ButtonGhost highlight={HighlightType.WARN} bg={backgroundNumber}>Button
                        Warn
                    </ButtonGhost>
                </ShowcaseRow>
                <ShowcaseRow>
                    <ButtonGhost highlight={HighlightType.NONE} bg={backgroundNumber}>Enabled</ButtonGhost>
                    <ButtonGhost highlight={HighlightType.NONE} bg={backgroundNumber}>
                        <AiFillHome/>
                        With Icons
                        <AiFillCaretRight/>
                    </ButtonGhost>
                    <ButtonGhost highlight={HighlightType.NONE} disabled={true} bg={backgroundNumber}>Disabled</ButtonGhost>
                    <ButtonGhost highlight={HighlightType.NONE} small={true} bg={backgroundNumber}>Small</ButtonGhost>
                    <ButtonGhost highlight={HighlightType.NONE} small={true} bg={backgroundNumber}>
                        <AiFillHome/>
                        Small with Icons
                        <AiFillCaretRight/>
                    </ButtonGhost>
                </ShowcaseRow>

                <h5>Text</h5>
                <ShowcaseRow>
                    <ButtonText highlight={HighlightType.NONE}>Button None</ButtonText>
                    <ButtonText highlight={HighlightType.INFO}>Button Info</ButtonText>
                    <ButtonText highlight={HighlightType.SUCCESS}>Button Success</ButtonText>
                    <ButtonText highlight={HighlightType.ERROR}>Button Error</ButtonText>
                    <ButtonText highlight={HighlightType.WARN}>Button Warn</ButtonText>
                </ShowcaseRow>
                <ShowcaseRow>
                    <ButtonText highlight={HighlightType.NONE}>Enabled</ButtonText>
                    <ButtonText highlight={HighlightType.NONE}>
                        <AiFillHome/>
                        With Icons
                        <AiFillCaretRight/>
                    </ButtonText>
                    <ButtonText highlight={HighlightType.NONE} disabled={true}>Disabled</ButtonText>
                    <ButtonText highlight={HighlightType.NONE} small={true}>Small</ButtonText>
                    <ButtonText highlight={HighlightType.NONE} small={true}>
                        <AiFillHome/>
                        Small with Icons
                        <AiFillCaretRight/>
                    </ButtonText>
                </ShowcaseRow>

            </>
        )
    }


}

function ShowcaseRow(props: React.PropsWithChildren<any>): any {
    return (
        <div className="showcase-row">
            {props.children}
        </div>
    )
}
