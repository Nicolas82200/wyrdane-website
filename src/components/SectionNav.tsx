import { useEffect, useState } from "react";

import "./SectionNav.css";

export type SectionNavItem = { id: string; label: string };

// Sommaire flottant sur le côté de la page d'accueil : masqué tant qu'on est
// sur la section héros (WYRDANE), affiché ensuite pour naviguer directement
// vers une section sans avoir à remonter tout en haut. La section active est
// mise en évidence au scroll (IntersectionObserver sur chaque section).
const SectionNav = ({ items }: { items: SectionNavItem[] }) => {
	const [visible, setVisible] = useState(false);
	const [activeId, setActiveId] = useState(items[0]?.id);

	useEffect(() => {
		const hero = document.getElementById("hero");
		if (!hero) return;
		const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
			threshold: 0.1,
		});
		observer.observe(hero);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const sections = items
			.map((item) => document.getElementById(item.id))
			.filter((el): el is HTMLElement => el !== null);
		if (sections.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const intersecting = entries.find((entry) => entry.isIntersecting);
				if (intersecting) setActiveId(intersecting.target.id);
			},
			{ rootMargin: "-45% 0px -50% 0px" },
		);
		sections.forEach((section) => observer.observe(section));
		return () => observer.disconnect();
	}, [items]);

	const scrollToSection = (id: string) => {
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<nav className={`section-nav ${visible ? "visible" : ""}`} aria-label="Sections de la page">
			{items.map((item) => (
				<button
					type="button"
					key={item.id}
					className={`section-nav-item ${activeId === item.id ? "active" : ""}`}
					onClick={() => scrollToSection(item.id)}
				>
					{item.label}
				</button>
			))}
		</nav>
	);
};

export default SectionNav;
