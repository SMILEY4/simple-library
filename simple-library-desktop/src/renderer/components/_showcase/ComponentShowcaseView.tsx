import * as React from 'react';
import {useState} from 'react';
import "./showcase.css";
import {Test} from "../_test/Test";

export function ComponentShowcaseView(): any {
    const [theme, setTheme] = useState("light-0");
    const themeName = (theme === "light-0" || theme === "light-1") ? "light" : "dark";
    const bgNr = (theme === "light-0" || theme === "dark-0") ? "0" : "1";
    return (
        <div className={
            "showcase-view"
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
            <div style={{
                height: "100vh",
                backgroundColor: "#1d1d1f",
                position: "relative",
                padding: "60px"
            }}>
                <Test/>
            </div>
        );
    }

}
