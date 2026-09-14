import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const usePrefersReducedMotion = () => {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(
		() => window.matchMedia(REDUCED_MOTION_QUERY).matches,
	);

	useEffect(() => {
		const mql = window.matchMedia(REDUCED_MOTION_QUERY);
		const onChange = () => setPrefersReducedMotion(mql.matches);
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return prefersReducedMotion;
};
