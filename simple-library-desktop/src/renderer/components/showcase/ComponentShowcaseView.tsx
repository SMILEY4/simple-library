import * as React from 'react';
import {useState} from 'react';
import "./showcase.css"
import {ButtonFilled, ButtonGhost, ButtonText} from "_renderer/components/Buttons";
import {HighlightType, StyleType} from "_renderer/components/Common";
import {AiFillCaretRight, AiFillHome, AiOutlineSearch, GoFileDirectory} from "react-icons/all";
import {InputField} from "_renderer/components/InputField";

export function ComponentShowcaseView(): any {
    const [theme, setTheme] = useState("light-0")
    const themeName = (theme === "light-0" || theme === "light-1") ? "light" : "dark"
    const bgNr = (theme === "light-0" || theme === "dark-0") ? "0" : "1"
    return (
        <div className={
            "showcase-view"
            + " theme-" + themeName
            + " background-" + bgNr
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

                <h3>Input Fields</h3>

                <ShowcaseRow>
                    <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT}/>
                    <InputField style={StyleType.FILLED} type={HighlightType.INFO}/>
                    <InputField style={StyleType.FILLED} type={HighlightType.SUCCESS}/>
                    <InputField style={StyleType.FILLED} type={HighlightType.ERROR}/>
                    <InputField style={StyleType.FILLED} type={HighlightType.WARN}/>
                </ShowcaseRow>

                <ShowcaseRow>
                    <InputField style={(bgNr === "0" ? StyleType.GHOST_BG0 : StyleType.GHOST_BG1)} type={HighlightType.DEFAULT}/>
                    <InputField style={(bgNr === "0" ? StyleType.GHOST_BG0 : StyleType.GHOST_BG1)} type={HighlightType.INFO}/>
                    <InputField style={(bgNr === "0" ? StyleType.GHOST_BG0 : StyleType.GHOST_BG1)} type={HighlightType.SUCCESS}/>
                    <InputField style={(bgNr === "0" ? StyleType.GHOST_BG0 : StyleType.GHOST_BG1)} type={HighlightType.ERROR}/>
                    <InputField style={(bgNr === "0" ? StyleType.GHOST_BG0 : StyleType.GHOST_BG1)} type={HighlightType.WARN}/>
                </ShowcaseRow>

                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} placeholder={"Placeholder"}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} initialText={"Initial"}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} initialText={"Initial+Placeholder"} placeholder={"Placeholder"}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} initialText={"Non-Editable"} editable={false}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} placeholder={"Disabled"} disabled={true}/>

                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} label={"E-Mail"} placeholder={"you@example.com"}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} icon={<AiFillHome/>}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} icon="$" placeholder={"0.00"}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} icon="http://" placeholder={"website.com"}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} contentLeading={
                    <ButtonFilled><GoFileDirectory/>Browse</ButtonFilled>}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} contentTrailing={
                    <ButtonFilled>Search</ButtonFilled>}/>
                <ShowcaseRow>
                    <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} contentTrailing={
                        <ButtonFilled><AiOutlineSearch/>Search</ButtonFilled>}/>
                    <InputField style={(bgNr === "0" ? StyleType.GHOST_BG0 : StyleType.GHOST_BG1)} type={HighlightType.DEFAULT} contentTrailing={
                        <ButtonFilled><AiOutlineSearch/>Search</ButtonFilled>}/>
                </ShowcaseRow>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} contentTrailing={
                    <ButtonFilled><AiFillHome/>Browse</ButtonFilled>}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} contentTrailing={
                    <ButtonGhost>Browse</ButtonGhost>}/>
                <InputField style={StyleType.FILLED} type={HighlightType.DEFAULT} contentTrailing={
                    <ButtonText>Browse</ButtonText>}/>


                <h3>Buttons</h3>

                <h5>Styles</h5>
                <ShowcaseRow>
                    <ButtonFilled>Filled</ButtonFilled>
                    <ButtonGhost bg={bgNr}>Ghost</ButtonGhost>
                    <ButtonText>Text</ButtonText>
                </ShowcaseRow>


                <h5>Filled</h5>
                <ShowcaseRow>
                    <ButtonFilled highlight={HighlightType.DEFAULT}>Button None</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.INFO}>Button Info</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.SUCCESS}>Button Success</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.ERROR}>Button Error</ButtonFilled>
                    <ButtonFilled highlight={HighlightType.WARN}>Button Warn</ButtonFilled>
                </ShowcaseRow>
                <ShowcaseRow>
                    <ButtonFilled>Enabled</ButtonFilled>
                    <ButtonFilled>
                        <AiFillHome/>
                        With Icons
                        <AiFillCaretRight/>
                    </ButtonFilled>
                    <ButtonFilled disabled={true}>Disabled</ButtonFilled>
                    <ButtonFilled small={true}>Small</ButtonFilled>
                    <ButtonFilled small={true}>
                        <AiFillHome/>
                        Small with Icons
                        <AiFillCaretRight/>
                    </ButtonFilled>
                </ShowcaseRow>

                <h5>Ghost</h5>
                <ShowcaseRow>
                    <ButtonGhost highlight={HighlightType.DEFAULT} bg={bgNr}>Button None</ButtonGhost>
                    <ButtonGhost highlight={HighlightType.INFO} bg={bgNr}>Button Info</ButtonGhost>
                    <ButtonGhost highlight={HighlightType.SUCCESS} bg={bgNr}>Button Success</ButtonGhost>
                    <ButtonGhost highlight={HighlightType.ERROR} bg={bgNr}>Button Error</ButtonGhost>
                    <ButtonGhost highlight={HighlightType.WARN} bg={bgNr}>Button Warn</ButtonGhost>
                </ShowcaseRow>
                <ShowcaseRow>
                    <ButtonGhost bg={bgNr}>Enabled</ButtonGhost>
                    <ButtonGhost bg={bgNr}>
                        <AiFillHome/>
                        With Icons
                        <AiFillCaretRight/>
                    </ButtonGhost>
                    <ButtonGhost disabled={true} bg={bgNr}>Disabled</ButtonGhost>
                    <ButtonGhost small={true} bg={bgNr}>Small</ButtonGhost>
                    <ButtonGhost small={true} bg={bgNr}>
                        <AiFillHome/>
                        Small with Icons
                        <AiFillCaretRight/>
                    </ButtonGhost>
                </ShowcaseRow>

                <h5>Text</h5>
                <ShowcaseRow>
                    <ButtonText highlight={HighlightType.DEFAULT}>Button None</ButtonText>
                    <ButtonText highlight={HighlightType.INFO}>Button Info</ButtonText>
                    <ButtonText highlight={HighlightType.SUCCESS}>Button Success</ButtonText>
                    <ButtonText highlight={HighlightType.ERROR}>Button Error</ButtonText>
                    <ButtonText highlight={HighlightType.WARN}>Button Warn</ButtonText>
                </ShowcaseRow>
                <ShowcaseRow>
                    <ButtonText>Enabled</ButtonText>
                    <ButtonText>
                        <AiFillHome/>
                        With Icons
                        <AiFillCaretRight/>
                    </ButtonText>
                    <ButtonText disabled={true}>Disabled</ButtonText>
                    <ButtonText small={true}>Small</ButtonText>
                    <ButtonText small={true}>
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
