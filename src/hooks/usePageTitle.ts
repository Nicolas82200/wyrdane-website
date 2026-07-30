import { useEffect } from "react";

export function usePageTitle(title?: string) {
	useEffect(() => {
		document.title = title ? `${title} — Wyrdane` : "Wyrdane — Dark Fantasy Card Game";
	}, [title]);
}
