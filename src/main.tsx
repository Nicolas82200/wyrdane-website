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

import { LanguageProvider } from "./i18n/LanguageContext";

import "./fonts.css";
import "./index.css";

// Deck builder routes (/decks, /decks/new, /decks/:deckId) are temporarily
// disabled — see ShowDecks.tsx / DeckBuilder.tsx, kept in place to re-enable later.
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
