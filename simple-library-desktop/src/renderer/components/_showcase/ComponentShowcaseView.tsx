import * as React from 'react';
import { ReactElement, useState } from 'react';
import "./showcase.css";
import { Text, TextVariant } from '../text/Text';
import { ColorType, GroupPosition, Type, Variant } from '../common';
import { Button } from '../button/Button';
import {
    AiFillCaretRight,
    AiFillHome,
    AiOutlineAlignCenter,
    AiOutlineAlignLeft,
    AiOutlineAlignRight,
} from 'react-icons/all';
import { Pane } from '../pane/Pane';

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

    function renderContent() {
        return (
            <>
                {renderButtons()}
                {renderPanesInteractive()}
                {renderText()}
            </>
        );
    }


    function renderButtons() {
        return (
            <>
                <h3>Buttons</h3>
                {renderButtonRow(Type.DEFAULT)}
                {renderButtonRow(Type.PRIMARY)}
                {renderButtonRow(Type.SUCCESS)}
                {renderButtonRow(Type.ERROR)}
                {renderButtonRow(Type.WARN)}
                <ShowcaseRow>
                    <Button type={Type.PRIMARY} variant={Variant.SOLID} icon={<AiFillHome />}>With Icon</Button>
                    <Button type={Type.DEFAULT} variant={Variant.SOLID} icon={<AiFillHome />}>With Icon</Button>
                    <Button type={Type.DEFAULT} variant={Variant.OUTLINE} icon={<AiFillHome />}>With Icon</Button>
                    <Button type={Type.DEFAULT} variant={Variant.GHOST} icon={<AiFillHome />}>With Icon</Button>
                    <Button type={Type.DEFAULT} variant={Variant.LINK} icon={<AiFillHome />}>With Icon</Button>
                </ShowcaseRow>
                <ShowcaseRow>
                    <Button disabled={true} type={Type.PRIMARY} variant={Variant.SOLID} icon={<AiFillHome />}>With
                        Icon</Button>
                    <Button type={Type.DEFAULT} disabled={true} variant={Variant.SOLID} icon={<AiFillHome />}>With
                        Icon</Button>
                    <Button type={Type.DEFAULT} disabled={true} variant={Variant.OUTLINE} icon={<AiFillHome />}>With
                        Icon</Button>
                    <Button type={Type.DEFAULT} disabled={true} variant={Variant.GHOST} icon={<AiFillHome />}>With
                        Icon</Button>
                    <Button type={Type.DEFAULT} disabled={true} variant={Variant.LINK} icon={<AiFillHome />}>With
                        Icon</Button>
                </ShowcaseRow>
                <Button type={Type.DEFAULT} variant={Variant.SOLID} icon={<AiFillHome />} iconRight={
                    <AiFillCaretRight />}>Two
                    Icons</Button>
                <ShowcaseRow>
                    <Button type={Type.PRIMARY} variant={Variant.SOLID} icon={<AiFillHome />} />
                    <Button type={Type.DEFAULT} variant={Variant.SOLID} icon={<AiFillHome />} />
                    <Button type={Type.DEFAULT} variant={Variant.OUTLINE} icon={<AiFillHome />} />
                    <Button type={Type.DEFAULT} variant={Variant.GHOST} icon={<AiFillHome />} />
                    <Button type={Type.DEFAULT} variant={Variant.LINK} icon={<AiFillHome />} />
                </ShowcaseRow>
                <ShowcaseRow>
                    <Button square={true} type={Type.PRIMARY} variant={Variant.SOLID} icon={<AiFillHome />} />
                    <Button square={true} type={Type.DEFAULT} variant={Variant.SOLID} icon={<AiFillHome />} />
                    <Button square={true} type={Type.DEFAULT} variant={Variant.OUTLINE} icon={<AiFillHome />} />
                    <Button square={true} type={Type.DEFAULT} variant={Variant.GHOST} icon={<AiFillHome />} />
                    <Button square={true} type={Type.DEFAULT} variant={Variant.LINK} icon={<AiFillHome />} />
                </ShowcaseRow>
                <ShowcaseRow>
                    <div style={{ display: 'flex' }}>
                        <Button type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.START}>Start</Button>
                        <Button type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.MIDDLE}>Middle</Button>
                        <Button type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.MIDDLE}>Middle</Button>
                        <Button type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.END}>End</Button>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Button type={Type.DEFAULT} variant={Variant.OUTLINE} groupPos={GroupPosition.START}>Start</Button>
                        <Button type={Type.DEFAULT} variant={Variant.OUTLINE} groupPos={GroupPosition.MIDDLE}>Middle</Button>
                        <Button type={Type.DEFAULT} variant={Variant.OUTLINE} groupPos={GroupPosition.MIDDLE}>Middle</Button>
                        <Button type={Type.DEFAULT} variant={Variant.OUTLINE} groupPos={GroupPosition.END}>End</Button>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Button type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.START} icon={
                            <AiOutlineAlignRight />} />
                        <Button type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.MIDDLE} icon={
                            <AiOutlineAlignCenter />} />
                        <Button type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.END} icon={
                            <AiOutlineAlignLeft />} />
                    </div>
                </ShowcaseRow>

            </>
        );

        function renderButtonRow(type: Type) {
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
    }


    function renderPanesInteractive() {
        const settingBase: any = {
            ghost: {
                typeOutline: undefined,
                typeDefault: undefined,
                typeReady: ColorType.BASE_0,
                typeActive: ColorType.BASE_1,
            },
            outline: {
                typeOutline: ColorType.BASE_4,
                typeDefault: undefined,
                typeReady: ColorType.BASE_0,
                typeActive: ColorType.BASE_1,
            },
            filled: {
                typeOutline: ColorType.BASE_4,
                typeDefault: ColorType.BASE_1,
                typeReady: ColorType.BASE_2,
                typeActive: ColorType.BASE_3,
            },
        };
        const settingPrimary: any = {
            ghost: {
                typeOutline: undefined,
                typeDefault: undefined,
                typeReady: ColorType.PRIMARY_0,
                typeActive: ColorType.PRIMARY_1,
            },
            outline: {
                typeOutline: ColorType.PRIMARY_4,
                typeDefault: undefined,
                typeReady: ColorType.PRIMARY_0,
                typeActive: ColorType.PRIMARY_1,
            },
            filled: {
                typeOutline: ColorType.PRIMARY_2,
                typeDefault: ColorType.PRIMARY_2,
                typeReady: ColorType.PRIMARY_3,
                typeActive: ColorType.PRIMARY_4,
            },
        };
        const settingSuccess: any = {
            ghost: {
                typeOutline: undefined,
                typeDefault: undefined,
                typeReady: ColorType.SUCCESS_0,
                typeActive: ColorType.SUCCESS_1,
            },
            outline: {
                typeOutline: ColorType.SUCCESS_4,
                typeDefault: undefined,
                typeReady: ColorType.SUCCESS_0,
                typeActive: ColorType.SUCCESS_1,
            },
            filled: {
                typeOutline: ColorType.SUCCESS_2,
                typeDefault: ColorType.SUCCESS_2,
                typeReady: ColorType.SUCCESS_3,
                typeActive: ColorType.SUCCESS_4,
            },
        };
        const settingError: any = {
            ghost: {
                typeOutline: undefined,
                typeDefault: undefined,
                typeReady: ColorType.ERROR_0,
                typeActive: ColorType.ERROR_1,
            },
            outline: {
                typeOutline: ColorType.ERROR_4,
                typeDefault: undefined,
                typeReady: ColorType.ERROR_0,
                typeActive: ColorType.ERROR_1,
            },
            filled: {
                typeOutline: ColorType.ERROR_2,
                typeDefault: ColorType.ERROR_2,
                typeReady: ColorType.ERROR_3,
                typeActive: ColorType.ERROR_4,
            },
        };
        const settingWarn: any = {
            ghost: {
                typeOutline: undefined,
                typeDefault: undefined,
                typeReady: ColorType.WARN_0,
                typeActive: ColorType.WARN_1,
            },
            outline: {
                typeOutline: ColorType.WARN_4,
                typeDefault: undefined,
                typeReady: ColorType.WARN_0,
                typeActive: ColorType.WARN_1,
            },
            filled: {
                typeOutline: ColorType.WARN_2,
                typeDefault: ColorType.WARN_2,
                typeReady: ColorType.WARN_3,
                typeActive: ColorType.WARN_4,
            },
        };

        function paneRow(settings: any): ReactElement {
            return (
                <ShowcaseRow>
                    {[
                        pane(settings.ghost),
                        pane(settings.outline),
                        pane(settings.filled),
                    ]}
                </ShowcaseRow>
            );
        }

        function pane(variantSettings: any): ReactElement {
            return <Pane
                outline={variantSettings.typeOutline}
                fillDefault={variantSettings.typeDefault}
                fillReady={variantSettings.typeReady}
                fillActive={variantSettings.typeActive}
                domProps={{
                    className: "behaviour-no-select",
                    style: {
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    },
                }}
            >P</Pane>;
        }

        return (
            <>
                <h3>Panes</h3>
                {
                    [settingBase, settingPrimary, settingSuccess, settingWarn, settingError].map((settings: any) => {
                        return paneRow(settings);
                    })
                }
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
                <Text variant={TextVariant.BODY} type={Type.PRIMARY}>Primary</Text>
                <Text variant={TextVariant.BODY} type={Type.SUCCESS}>Success</Text>
                <Text variant={TextVariant.BODY} type={Type.WARN}>Warn</Text>
                <Text variant={TextVariant.BODY} type={Type.ERROR}>Error</Text>
            </>
        );
    }


}


function ShowcaseRow(props: React.PropsWithChildren<any>): any {
    return (
        <div className={'showcase-row' + (props.fullWidth ? ' showcase-row-full-width' : '')}>
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
