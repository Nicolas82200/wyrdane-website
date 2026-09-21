import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import Home from "./pages/Home";
import Play from "./pages/Play";
import News from "./pages/News";
import Contact from "./pages/Contact";
import LegalPage from "./pages/LegalPage";
import RouteError from "./pages/RouteError";
import ShowDecks from "./pages/ShowDecks";
import DeckBuilder from "./pages/DeckBuilder";
import Admin from "./pages/Admin";
import AdminCardStats from "./pages/AdminCardStats";

import AuthRequire from "./helper/AuthRequire";
import AdminRequire from "./helper/AdminRequire";
import { LanguageProvider } from "./i18n/LanguageContext";
import { AuthProvider } from "./auth/AuthProvider";

import "./fonts.css";
import "./index.css";

const router = createBrowserRouter([
	{
		element: <App />,
		errorElement: <RouteError />,
		children: [
			{ path: "/", element: <Home /> },
			{ path: "/play", element: <Play /> },
			{ path: "/news", element: <News /> },
			// Page unique Actualités/Devlog (voir NewsHub.tsx, filtre ?tab=devlog) :
			// on garde l'ancienne URL /dev-log en redirection pour ne pas casser les
			// liens déjà indexés/partagés.
			{ path: "/dev-log", element: <Navigate to="/news?tab=devlog" replace /> },
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
			{
				path: "/admin/card-stats",
				element: (
					<AdminRequire>
						<AdminCardStats />
					</AdminRequire>
				),
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<LanguageProvider>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</LanguageProvider>
	</React.StrictMode>,
);
