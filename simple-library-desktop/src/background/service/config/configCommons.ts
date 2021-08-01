export module ConfigCommons {

	export type AppTheme = "light" | "dark"

	export interface ExiftoolInfo {
		location: string | null;
		defined: boolean;
	}

	export interface LastOpenedEntry {
		name: string,
		path: string
	}

}
