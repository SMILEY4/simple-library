import * as React from "react";
import "./test.css"

export function Test(props: React.PropsWithChildren<any>) {

    return (
        <div className={"test"}>
            <div className={"test-body"}>


                <div className={"test-header"}>
                    Import Files
                </div>

                <div className={"test-button"}>
                    Quick-Import
                </div>

                <div className={"info-label"}>
                    Source Directory
                    <div className={"test-input"}>
                        C:\Users\Test\Desktop
                    </div>
                </div>

                <div className={"info-label"}>
                    Target Directory
                    <div className={"test-input"}>
                        C:\Target
                    </div>
                </div>


            </div>

            <div className={"test-footer"}>

                <div className={"test-button test-button-secondary"}>
                    Cancel
                </div>

                <div className={"test-button test-button-primary"}>
                    Import
                </div>

            </div>

        </div>
    );

}
