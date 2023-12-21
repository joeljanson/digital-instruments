import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./App.scss";
import { start } from "tone";

import Session from "./Session/Session/Session";
import "./Database Connections/firebaseConfig";

import HomePage from "./Home/Hompage";
import {
	addInstruments,
	addNewSessionToFirestore,
	updateSessionInFirestore,
} from "./resources/data/WriteToSession";

function App() {
	const [toneStarted, setToneStarted] = useState(false);
	const startTone = async () => {
		await start();
		console.log("Tone started!");
		setToneStarted(true);
	};

	const handleUpdateClick = () => {
		//updateSessionInFirestore();
		//addNewSessionToFirestore();
		addInstruments();
	};

	return (
		<div>
			{/* <button onClick={handleUpdateClick}>Update Session</button> */}

			<Router>
				<Routes>
					<Route path="/session/:sessionId" element={<Session />} />
					<Route path="/moment" element={<HomePage />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
