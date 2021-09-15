import React from "react";
import {Slot} from "../../../components/base/slot/Slot";
import {VBox} from "../../../components/layout/box/Box";
import {Label} from "../../../components/base/label/Label";
import {Button} from "../../../components/buttons/button/Button";
import {requestOpenConfigFile} from "../../common/eventInterface";
import {Card} from "../../../components/layout/card/Card";

const shell = require("electron").shell

interface DialogErrorExiftoolLocationProps {
}

export function DialogErrorExiftoolLocation(props: React.PropsWithChildren<DialogErrorExiftoolLocationProps>): React.ReactElement {

	return (
		<Card
			title={"Error"}
			closable={false}
		>
			<Slot name={"body"}>
				<VBox alignMain="center" alignCross="stretch" spacing="0-5">
					<Label bold>
						Exiftool is required but was not found!
					</Label>
					<Label>
						Visit
						<a
							href={null}
							style={{
								cursor: "pointer",
								textDecoration: "underline"
							}}
							onClick={handleOpenLink}
						>
							https://exiftool.org/
						</a>
						for instructions on how to install Exiftool.
					</Label>
					<Label>
						After installation, set the "exiftool"-field in the config to the absolute path to the
						exiftool-executable. <br/>The application must be restarted for the change to take effect.
					</Label>
					<Button style={{marginLeft: "auto"}} onAction={() => requestOpenConfigFile()}>
						Open Config
					</Button>
				</VBox>
			</Slot>
			<Slot name={"footer"}/>
		</Card>
	);

	function handleOpenLink() {
		shell.openExternal("https://exiftool.org/")
	}

}
