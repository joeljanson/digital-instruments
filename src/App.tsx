import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./App.scss";
import { start } from "tone";

import Session from "./Session/Session/Session";
import "./Database Connections/firebaseConfig";

import HomePage from "./Home/Hompage";
import { addInstruments } from "./resources/data/WriteToSession";
import MomentUserContextProvider from "./Contexts/MomentUserContextProvider";
import { loginAnonymously } from "./Database Connections/users/loginAndSignup";

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

			<MomentUserContextProvider>
				<Router>
					<Routes>
						<Route path="/session/:sessionId" element={<Session />} />
						<Route path="/moment" element={<HomePage />} />
					</Routes>
				</Router>
			</MomentUserContextProvider>
		</div>
	);
}

export default App;
