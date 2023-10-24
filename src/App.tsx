import React, { useEffect, useState } from "react";
import "./App.css";
import Divisions from "./Components/Instruments/Divisions";
import { context, start } from "tone";

function App() {
	const [toneStarted, setToneStarted] = useState(false);
	const startTone = async () => {
		await start();
		console.log("Tone started!");
		setToneStarted(true);
	};

	useEffect(() => {
		const state = context.state;
		console.log(`Audio context state: ${state}`);

		if (state === "suspended") {
			// Context is created but not yet playing
			setToneStarted(false);
		} else if (state === "running") {
			// Context is active and playing
			setToneStarted(true);
		} else if (state === "closed") {
			// Context has been closed
			setToneStarted(false);
		}
	}, []);

	return (
		<div className="App" onClick={startTone}>
			<header className="App-header">
				{!!!toneStarted ? <h1>Click anywhere to unmute sound.</h1> : ""}
				<Divisions></Divisions>
			</header>
		</div>
	);
}

export default App;
