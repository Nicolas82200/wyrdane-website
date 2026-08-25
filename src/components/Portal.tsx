import { createPortal } from "react-dom";
import type { ReactNode } from "react";

// Monte ses enfants directement sous <body> plutôt que là où le composant
// est déclaré dans l'arbre React. Utilisé pour les overlays plein écran
// (position: fixed) déclenchés depuis la Navbar : celle-ci est en
// position: sticky, et un fixed imbriqué dans un ancêtre au comportement de
// positionnement non trivial peut se retrouver mal centré selon le
// navigateur — le portail élimine complètement cette dépendance à l'endroit
// où l'overlay est rendu dans l'arbre.
const Portal = ({ children }: { children: ReactNode }) => createPortal(children, document.body);

export default Portal;
