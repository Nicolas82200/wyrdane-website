import { useEffect, useRef, useState, type ReactNode } from "react";

import "./Reveal.css";

type RevealProps = {
	children: ReactNode;
	className?: string;
	delay?: number;
	// Transmis tel quel au conteneur : utilisé par les sections de la page
	// d'accueil comme ancre pour SectionNav.tsx (scrollIntoView + observer).
	id?: string;
};

// Anime l'apparition d'un bloc quand il entre dans le viewport au scroll.
const Reveal = ({ children, className = "", delay = 0, id }: RevealProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15, rootMargin: "0px 0px -80px 0px" },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			id={id}
			className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
			style={delay ? { transitionDelay: `${delay}ms` } : undefined}
		>
			{children}
		</div>
	);
};

export default Reveal;
