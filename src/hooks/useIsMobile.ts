import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 760px)";

export const useIsMobile = (query: string = MOBILE_QUERY) => {
	const [isMobile, setIsMobile] = useState(
		() => window.matchMedia(query).matches,
	);

	useEffect(() => {
		const mql = window.matchMedia(query);
		const onChange = () => setIsMobile(mql.matches);
		setIsMobile(mql.matches);
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, [query]);

	return isMobile;
};
