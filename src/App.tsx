import React, { useEffect, useState } from "react";
import "./App.css";
import Divisions from "./Components/Instruments/Divisions";
import { Emitter, context, start } from "tone";
import SequencerArea from "./Components/Sequencers/SequenceArea";
import EffectsRack from "./Components/Audio-routing/Effect-components/EffectsRack";
import DelayEffect from "./Components/Audio-routing/Effect-components/DelayEffect";
import ReverbEffect from "./Components/Audio-routing/Effect-components/ReverbEffect";

export const globalEmitter = new Emitter();

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
				<SequencerArea></SequencerArea>
				{!!!toneStarted ? <h1>Click anywhere to unmute sound.</h1> : ""}
				<Divisions></Divisions>
				<EffectsRack receive="effectsRackIn" send="effectsRackOut">
					{[
						<DelayEffect
							effectInput="effectRack-0-in"
							effectOutput="effectRack-0-out"
							key="0"
						/>,
						<ReverbEffect
							effectInput="effectRack-1-in"
							effectOutput="effectRack-1-out"
							key="1"
						/>,
					]}
				</EffectsRack>
			</header>
		</div>
	);
}

export default App;
