import React, { useEffect, useState } from "react";
import "./App.scss";
import Divisions from "./Components/Instruments/Divisions";
import { Emitter, context, start } from "tone";
import SequencerArea from "./Components/Sequencers/SequenceArea";
import EffectsRack from "./Components/Audio-routing/Effect-components/EffectsRack";
import DelayEffect from "./Components/Audio-routing/Effect-components/DelayEffect";
import ReverbEffect from "./Components/Audio-routing/Effect-components/ReverbEffect";
import ChorusEffect from "./Components/Audio-routing/Effect-components/ChorusEffect";
import DistortionEffect from "./Components/Audio-routing/Effect-components/DistortionEffect";
import ConvolverEffect from "./Components/Audio-routing/Effect-components/ConvolverEffect";
import StepSequencer from "./Components/Sequencers/StepSequencer";
import TapeMachine from "./Components/Audio-routing/Tape/TapeMachine";
import StereoWidenerEffect from "./Components/Audio-routing/Effect-components/StereoWidenerEffect";

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
				{/* <StepSequencer></StepSequencer> */}
				{!!!toneStarted ? <h1>Click anywhere to unmute sound.</h1> : ""}
				<Divisions></Divisions>
				<div className="module-area-wrapper">
					<EffectsRack receive="effectsRackIn" send="effectsRackOut">
						{[<ConvolverEffect key="2" />, <DelayEffect key="1" />]}
					</EffectsRack>
					<TapeMachine
						receive="effectsRackOut"
						send="tapeMachineOut"
					></TapeMachine>
				</div>
			</header>
		</div>
	);
}

export default App;
