import React, { useEffect, useState } from "react";
import "./App.scss";
import Divisions from "./Components/Instruments/Divisions";
import { Emitter, ToneAudioBuffer, context, start } from "tone";
import SequencerArea from "./Components/Sequencers/SequenceArea";
import EffectsRack from "./Components/Audio-routing/Effect-components/EffectsRack";
import DelayEffect from "./Components/Audio-routing/Effect-components/DelayEffect";
import ConvolverEffect from "./Components/Audio-routing/Effect-components/ConvolverEffect";
import TapeMachine from "./Components/Audio-routing/Tape/TapeMachine";
import GranDame from "./Components/Instruments/GranDame";
import { Chains } from "./Components/Sequencers/SequencerComponents/SequencerComponentInterfaces";
export const globalEmitter = new Emitter();

/* TEST CHAIN */

const chainsData: Chains = [
	[
		{ name: "input", type: "all" }, // This matches InputComponentDef
		{
			name: "chordcreator",
			chords: [
				{ note: 0, voicing: [0, 4, 7] },
				{ note: 4, voicing: [0, 5, 12] },
				{ note: 2, voicing: [0, 3, 7] },
			],
		}, // This matches ChordCreatorDef
		/* { name: "stepsequencer", steps: 8 }, // This matches InputComponentDef */
		{ name: "output", output: "SEQUENCER_EVENT" }, // This matches InputComponentDef
	],
	// ...additional chains
];

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

		/* async function processDrumSamples(url: string) {
			try {
				const buffer = await ToneAudioBuffer.load(url);
				const audioBuffer = new ToneAudioBuffer(buffer);

				const detector = new StripSilence(0.9, 0.05); // Threshold set to 0.1
				const onsets = await detector.findSampleOnsets(audioBuffer);
				console.log("Onsets:", onsets);
			} catch (error) {
				console.error("Error processing drum samples:", error);
			}
		}

		// Example usage
		processDrumSamples(beat1); */
	}, []);

	return (
		<div className="App" onClick={startTone}>
			<div className="top-bar-area">
				Top bar area{" "}
				{!!!toneStarted ? (
					<h1>Click anywhere to unmute sound.</h1>
				) : (
					"Tone started!"
				)}
			</div>
			<header className="main-area">
				<SequencerArea chains={chainsData} />
				{/* <StepSequencer /> */}
				{/* <ChordCreator /> */}
				{/* <Divisions triggerEventName="SEQUENCER_EVENT" /> */}
				<GranDame></GranDame>
				<GranDame></GranDame>
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
