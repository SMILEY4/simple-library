export const CFG_LAST_OPENED: string = "lastOpened";
export const CFG_THEME: string = "theme";
export const CFG_EXIFTOOL_LOCATION: string = "exiftool";

export type AppTheme = "light" | "dark"

export interface ExiftoolInfo {
	location: string | null;
	defined: boolean;
}

export interface LastOpenedEntry {
	name: string,
	path: string
}
