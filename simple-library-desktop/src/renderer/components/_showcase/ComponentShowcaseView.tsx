import * as React from 'react';
import { useState } from 'react';
import "./showcase.css";
import {
    AiFillCaretRight,
    AiFillFolder,
    AiFillHome,
    AiOutlineAlignCenter,
    AiOutlineAlignLeft,
    AiOutlineAlignRight,
    AiOutlineSearch,
} from 'react-icons/all';
import { InputField } from '../inputfield/InputField';
import { GroupPosition, Type, Variant } from '../common';
import { LabelBox } from '../text/LabelBox';
import { Button } from '../button/Button';
import { Text, TextVariant } from '../text/Text';

export function ComponentShowcaseView(): any {
    const [theme, setTheme] = useState("light-0");
    const themeName = (theme === "light-0" || theme === "light-1") ? "light" : "dark";
    const bgNr = (theme === "light-0" || theme === "dark-0") ? "0" : "1";
    return (
        <div className={
            "_showcase-view"
            + " theme-" + themeName
            + " background-" + bgNr
        }>
            <div className='showcase-controls'>
                <div onClick={() => setTheme("light-0")}>Light-0</div>
                <div onClick={() => setTheme("light-1")}>Light-1</div>
                <div onClick={() => setTheme("dark-0")}>Dark-0</div>
                <div onClick={() => setTheme("dark-1")}>Dark-1</div>
            </div>
            <div className='showcase-content' id='showcase-content'>
                {renderContent()}
            </div>
        </div>
    );


    function renderInputField() {
        return (
            <>
                <h3>Input Field</h3>
                <ShowcaseRow>
                    <InputField placeholder={"Input"}
                                initialValue={"Initial"}
                                onChange={value => console.log("changed:" + value)}
                                onAccept={value => console.log("accept:" + value)} />
                    <InputField disabled={true} initialValue={"Disabled"} />
                    <InputField locked={true} initialValue={"Locked"} />
                </ShowcaseRow>
                <ShowcaseRow>
                    <InputField icon={<AiOutlineSearch />} placeholder={"Icon Left"} />
                    <InputField iconRight={<AiOutlineSearch />} placeholder={"Icon Right"} />
                    <InputField icon={<AiFillFolder />} iconRight={<AiOutlineSearch />} placeholder={"Two Icons"} />
                </ShowcaseRow>

                <InputField placeholder={"example.com"}
                            contentLeading={
                                <LabelBox variant={Variant.OUTLINE} groupPos={GroupPosition.START}>https://</LabelBox>
                            }
                />
                <InputField placeholder={"info.example"}
                            contentTrailing={
                                <LabelBox variant={Variant.OUTLINE} groupPos={GroupPosition.END}>@email.me</LabelBox>
                            }
                />
                <InputField placeholder={"example"}
                            contentLeading={
                                <LabelBox variant={Variant.OUTLINE} groupPos={GroupPosition.START}>https://</LabelBox>
                            }
                            contentTrailing={
                                <LabelBox variant={Variant.OUTLINE} groupPos={GroupPosition.END}>.com</LabelBox>
                            }
                />

                <InputField placeholder={"Input"}
                            icon={<AiOutlineSearch />}
                            contentTrailing={
                                <Button variant={Variant.SOLID} groupPos={GroupPosition.END}>Search</Button>
                            }
                />

            </>
        );
    }


    function renderButtonRow(type?: Type) {
        return (
            <ShowcaseRow>
                <Button type={type} variant={Variant.SOLID}>Solid</Button>
                <Button type={type} variant={Variant.OUTLINE}>Outline</Button>
                <Button type={type} variant={Variant.GHOST}>Ghost</Button>
                <Button type={type} variant={Variant.LINK}>Link</Button>
                <Button type={type} disabled={true} variant={Variant.SOLID}>Solid</Button>
                <Button type={type} disabled={true} variant={Variant.OUTLINE}>Outline</Button>
                <Button type={type} disabled={true} variant={Variant.GHOST}>Ghost</Button>
                <Button type={type} disabled={true} variant={Variant.LINK}>Link</Button>
            </ShowcaseRow>
        );
    }

    function renderButtons() {
        return (
            <>
                <h3>Buttons</h3>
                {renderButtonRow()}
                {renderButtonRow(Type.PRIMARY)}
                {renderButtonRow(Type.SUCCESS)}
                {renderButtonRow(Type.ERROR)}
                {renderButtonRow(Type.WARN)}
                <ShowcaseRow>
                    <Button type={Type.PRIMARY} variant={Variant.SOLID} icon={<AiFillHome />}>With
                        Icon</Button>
                    <Button variant={Variant.SOLID} icon={<AiFillHome />}>With Icon</Button>
                    <Button variant={Variant.OUTLINE} icon={<AiFillHome />}>With Icon</Button>
                    <Button variant={Variant.GHOST} icon={<AiFillHome />}>With Icon</Button>
                    <Button variant={Variant.LINK} icon={<AiFillHome />}>With Icon</Button>
                </ShowcaseRow>
                <Button variant={Variant.SOLID} icon={<AiFillHome />} iconRight={<AiFillCaretRight />}>Two
                    Icons</Button>
                <ShowcaseRow>
                    <Button type={Type.PRIMARY} variant={Variant.SOLID} icon={<AiFillHome />} />
                    <Button variant={Variant.SOLID} icon={<AiFillHome />} />
                    <Button variant={Variant.OUTLINE} icon={<AiFillHome />} />
                    <Button variant={Variant.GHOST} icon={<AiFillHome />} />
                    <Button variant={Variant.LINK} icon={<AiFillHome />} />
                </ShowcaseRow>
                <ShowcaseRow>
                    <div style={{ display: 'flex' }}>
                        <Button variant={Variant.SOLID} groupPos={GroupPosition.START}>Start</Button>
                        <Button variant={Variant.SOLID} groupPos={GroupPosition.MIDDLE}>Middle</Button>
                        <Button variant={Variant.SOLID} groupPos={GroupPosition.MIDDLE}>Middle</Button>
                        <Button variant={Variant.SOLID} groupPos={GroupPosition.END}>End</Button>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Button variant={Variant.OUTLINE} groupPos={GroupPosition.START}>Start</Button>
                        <Button variant={Variant.OUTLINE} groupPos={GroupPosition.MIDDLE}>Middle</Button>
                        <Button variant={Variant.OUTLINE} groupPos={GroupPosition.MIDDLE}>Middle</Button>
                        <Button variant={Variant.OUTLINE} groupPos={GroupPosition.END}>End</Button>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Button variant={Variant.SOLID} groupPos={GroupPosition.START} icon={<AiOutlineAlignRight />} />
                        <Button variant={Variant.SOLID} groupPos={GroupPosition.MIDDLE} icon={
                            <AiOutlineAlignCenter />} />
                        <Button variant={Variant.SOLID} groupPos={GroupPosition.END} icon={<AiOutlineAlignLeft />} />
                    </div>
                </ShowcaseRow>

            </>
        );
    }

    function renderText() {
        return (
            <>
                <h3>Text</h3>
                <Text variant={TextVariant.H1}>Heading 1</Text>
                <Text variant={TextVariant.H2}>Heading 2</Text>
                <Text variant={TextVariant.H3}>Heading 3</Text>
                <Text variant={TextVariant.H4}>Heading 4</Text>
                <Text variant={TextVariant.H5}>Heading 5</Text>
                <Text variant={TextVariant.BODY}>Body</Text>
                <Text variant={TextVariant.CAPTION}>Caption</Text>
            </>
        );
    }


    function renderContent() {
        return (
            <>
                {renderInputField()}
                {renderButtons()}
                {renderText()}
            </>
        );
    }
}


function ShowcaseRow(props: React.PropsWithChildren<any>): any {
    return (
        <div className='showcase-row'>
            {props.children}
        </div>
    );
}


function ToggleableShowcase(props: React.PropsWithChildren<any>): any {
    const [show, setShow] = useState(false);
    return (
        <div>
            <button onClick={() => setShow(!show)}>{props.text}</button>
            {
                show
                    ? props.children
                    : null
            }
        </div>
    );
}


function StatefulComponent(props: React.PropsWithChildren<any>): any {
    const [data, setData] = useState(props.initialState);
    return (
        <div>
            <button onClick={() => setData(props.onAction(data))}>{props.title}</button>
            {props.renderContent(data)}
        </div>
    );
}
