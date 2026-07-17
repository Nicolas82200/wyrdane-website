import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import Home from "./pages/Home";
import ShowDecks from "./pages/ShowDecks";
import DeckBuilder from "./pages/DeckBuilder";

import AuthRequire from "./helper/AuthRequire";

import "./index.css";

const router = createBrowserRouter([
	{
		element: <App />,
		children: [
			{ path: "/", element: <Home /> },
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
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
