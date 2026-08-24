import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import Home from "./pages/Home";
import Play from "./pages/Play";
import News from "./pages/News";
import DevLog from "./pages/DevLog";
import Contact from "./pages/Contact";
import LegalPage from "./pages/LegalPage";
import RouteError from "./pages/RouteError";
import ShowDecks from "./pages/ShowDecks";
import DeckBuilder from "./pages/DeckBuilder";
import Admin from "./pages/Admin";

import AuthRequire from "./helper/AuthRequire";
import AdminRequire from "./helper/AdminRequire";
import { LanguageProvider } from "./i18n/LanguageContext";

import "./fonts.css";
import "./index.css";

// Deck builder routes (/decks, /decks/new, /decks/:deckId) are reachable by
// direct URL only for now (private testing) — intentionally not linked from
// Navbar or anywhere else on the site.
const router = createBrowserRouter([
	{
		element: <App />,
		errorElement: <RouteError />,
		children: [
			{ path: "/", element: <Home /> },
			{ path: "/play", element: <Play /> },
			{ path: "/news", element: <News /> },
			{ path: "/dev-log", element: <DevLog /> },
			{ path: "/contact", element: <Contact /> },
			{ path: "/mentions-legales", element: <LegalPage pageKey="legalNotice" /> },
			{ path: "/cgu", element: <LegalPage pageKey="terms" /> },
			{ path: "/confidentialite", element: <LegalPage pageKey="privacy" /> },
			{ path: "/cgv", element: <LegalPage pageKey="sales" /> },
			{
				path: "/decks",
				element: (
					<AuthRequire>
						<ShowDecks />
					</AuthRequire>
				),
			},
			{
				path: "/decks/new",
				element: (
					<AuthRequire>
						<DeckBuilder />
					</AuthRequire>
				),
			},
			{
				path: "/decks/:deckId",
				element: (
					<AuthRequire>
						<DeckBuilder />
					</AuthRequire>
				),
			},
			{
				// Non listée dans la Navbar : accessible par URL directe uniquement.
				path: "/admin",
				element: (
					<AdminRequire>
						<Admin />
					</AdminRequire>
				),
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<LanguageProvider>
			<RouterProvider router={router} />
		</LanguageProvider>
	</React.StrictMode>,
);
